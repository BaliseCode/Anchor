<?php
class CleanerBackEnd
{
    private $menu = array();
    private $submenu = array();

    public function __construct()
    {
        add_action('admin_menu', array($this, 'addDevPage'), 20000000);
        add_action('admin_menu', array($this, 'editAdminMenu'), 20000001);
        add_action('admin_init', array($this, 'catchDevSettings'));
        if (get_option('removeComments')) {
            add_action('init', array($this, 'removeCommentsSupport'));
            add_action('wp_before_admin_bar_render', array($this, 'removeCommentsMenubar'));
        }
        add_action('admin_bar_menu', function ($admin_bar) {
            if (!get_user_option('userDevmode', get_current_user_id())) {
                $label = "Mode simple";
            } else {
                $label = "Mode avanc&eacute;";
            }
            $admin_bar->add_menu(array(
                'id'    => 'toggleMode',
                'title' => $label,
                'href'  => '?toggle_dev_mode=1',
                'meta'  => array(
                    'title' => __('My Item'),
                ),
            ));
        }, 100);


        if (isset($_GET['toggle_dev_mode'])) {
            $devMode = (!get_user_option('userDevmode', get_current_user_id()));
            update_user_option(get_current_user_id(), 'userDevmode',  $devMode, false);
            if ($devMode) {
                header('Location: ' . get_admin_url());
            } else {
                header('Location: ' . get_admin_url());
            }
        }
    }

    function editAdminMenu()
    {
        global $menu;
        global $submenu;

        $this->menu = $menu;
        $this->submenu = $submenu;

        $optionsMenuItem = get_option('removeMenuItem');

        // If Developer mode is activated
        if (!get_user_option('userDevmode', get_current_user_id())) {
            remove_menu_page('themes.php');
            remove_menu_page('plugins.php');
            remove_menu_page('tools.php');
            remove_menu_page('options-general.php');
            if (current_theme_supports('menus')) add_menu_page(_('Menus'), _('Menus'), 'edit_theme_options', 'nav-menus.php', '', 'dashicons-welcome-widgets-menus', 4);
        }
        // Clean other menu items
        if ($optionsMenuItem) {
            foreach ($optionsMenuItem as $key => $val) {
                if ($key !== "index.php") {

                    remove_menu_page($key);
                } else {
                    $removeIndex = true;
                }
            }
        }
        // Remove comments
        if (get_option('removeComments')) {
            remove_menu_page('edit-comments.php');
            remove_meta_box('commentsdiv', 'page', 'normal');
            remove_meta_box('commentsdiv', 'post', 'normal');
            remove_meta_box('commentstatusdiv', 'page', 'normal');
            remove_meta_box('trackbacksdiv', 'page', 'normal');
        }
        // Clean extra socket_cmsg_space
        $i = 0;
        $lastItem = array();
        foreach ($menu as $menuItem) {
            if ($i == 0 && $menuItem[4] == 'wp-menu-separator') {
                array_shift($menu);
            } else {
                $i++;
            }
        }
    }
    function removeCommentsSupport()
    {
        remove_post_type_support('post', 'comments');
        remove_post_type_support('page', 'comments');
    }
    function removeCommentsMenubar()
    {
        global $wp_admin_bar;
        $wp_admin_bar->remove_menu('comments');
    }
    public function addDevPage()
    {
        if (get_user_option('userDevmode', get_current_user_id())) {
            add_menu_page(
                'Option de D&eacute;veloppeur',
                'D&eacute;veloppeurs',
                'manage_options',
                'dev_mode',
                array($this, 'createDevPage'),
                'dashicons-welcome-learn-more',
                20000000
            );
        }
    }
    public function createDevPage()
    {

?>
        <h1 class="wp-heading-inline">Mode</h1>
        <form method="post" action="options.php" style="max-width: 700px;">
            <?php
            settings_fields('_BaseFloorMenuContent');
            $this->optionsRemoveMenuItems = get_option('removeMenuItem');
            $this->optionsRemoveComments = get_option('removeComments');
            ?>
            <h2>D&eacute;sactiver les commentaires</h2>
            <table>
                <tbody>

                    <tr>
                        <td>
                            <?php printf('<input type="checkbox" id="removeComments" name="removeComments" %s>', ($this->optionsRemoveComments) ? ' checked' : ''); ?>
                        </td>
                        <td scope="row">
                            <label for="removeComments">D&eacute;sactiver</label>
                        </td>
                    </tr>

                </tbody>
            </table>
            <h2>Masquer des &eacute;l&eacute;ments du menu</h2>
            <table>
                <tbody>
                    <?php

                    foreach ($this->menu as $key => $item) {
                        $nom = $item[0];
                        if (
                            $item[2] !== 'edit-comments.php' &&
                            $item[2] !== 'themes.php' &&
                            $item[2] !== 'plugins.php' &&
                            $item[2] !== 'tools.php' &&
                            $item[2] !== 'options-general.php' &&
                            $item[2] !== 'dev_mode' &&
                            $item[0]
                        ) {
                    ?>
                            <tr>
                                <td>
                                    <?php printf('<input type="checkbox" id="removeMenuItem_' . $key . '" name="removeMenuItem[' . $item[2] . ']" %s />', isset($this->optionsRemoveMenuItems[$item[2]]) ? ' checked' : ''); ?>
                                </td>
                                <td scope="row">
                                    <label for="removeMenuItem_<?= $key; ?>"><?= $nom; ?></label>
                                </td>
                            </tr>
                    <?php
                        }
                    }
                    ?>
                </tbody>
            </table>
            <?php submit_button(); ?>
        </form>
<?php
    }
    public function catchDevSettings()
    {
        register_setting(
            '_BaseFloorMenuContent',
            'removeMenuItem'
        );
        register_setting(
            '_BaseFloorMenuContent',
            'removeComments',
            array($this, 'sanitizeBool')
        );
    }

    public function sanitizeBool($input)
    {
        return ($input) ? 1 : false;
    }
}
new CleanerBackEnd();
