<?php


use Windwalker\Renderer\BladeRenderer;



class PostWrapper {
    function __construct($post) {
        $this->title = $post->post_title;
        $this->content = preg_replace('/<!--(.|\s)*?-->/', '', $post->post_content);
    }
}
class BaliseAnchor {
    public static $renderer;
    public static $data;

    private static function getData() {
        global $post;
        $return = new PostWrapper($post);
        if (!is_singular()) {

        } else {

            $return->posts = array();
            while (have_posts()) {
                the_post();
                $subreturn = new PostWrapper($post);
                $return->posts[] = $subreturn;
            }
        }
        return $return;
    }
    private static function getTemplate() {
        if (is_404()) { return array('404','index'); }
        if (is_search()) { return array('search','index'); }
        if (is_singular()) {
            if (is_page()) {
                return array('page','index');
            } elseif(is_single()) {
                return array('single-post','single','index');
            } elseif (is_attachment()) {
                return array('attachment','index');
            }

        }
        return array('index');
    }

    private static function loadTemplate($array) {

        global $wp_styles,$wp_scripts;
        if (count($array)===0) return;
        if (!self::$renderer) {
            $paths = new \SplPriorityQueue;

            $paths->insert(get_template_directory().'/app/views', 200);
            $paths->insert(get_template_directory().'/framework/templates/blade', 100);
            self::$renderer = new BladeRenderer($paths, array('cache_path' => get_template_directory(). '/public/views/'));





            self::$renderer->addCustomCompiler('wp_head', function($expression) {
                return '<?php wp_head(); ?>';
            });

            self::$renderer->addCustomCompiler('wp_footer', function($expression) {
                return '<?php wp_footer(); ?>';
            });

        }
        try {
            self::$renderer->render($array[0], []);
            $wp_styles->done = array();
            $wp_scripts->done = array();
            $template = self::$renderer->render($array[0], self::$data);
            if (!is_admin()) {
                $wp_styles->done = array();
                $wp_scripts->done = array();
            }
            echo $template;

        } catch (Exception $e) {
            self::loadTemplate(array_slice($array,1));
        }
    }
    public static function render() {
        self::$data = self::getData();
        self::loadTemplate(self::getTemplate());

    }
}
