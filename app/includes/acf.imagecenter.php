<?php
if (class_exists('acf_field')) {
    class acf_field_image_center extends acf_field
    {
        function __construct()
        {
            $this->name = 'image_center';
            $this->label = __("Centered image", 'acf');
            $this->category = 'content';
            $this->defaults = array(
                'return_format'    => 'array',
                'preview_size'    => 'thumbnail',
                'library'        => 'all',
                'min_width'        => 0,
                'min_height'    => 0,
                'min_size'        => 0,
                'max_width'        => 0,
                'max_height'    => 0,
                'max_size'        => 0,
                'mime_types'    => ''
            );
            $this->l10n = array(
                'select'        => __("Select Image", 'acf'),
                'edit'            => __("Edit Image", 'acf'),
                'update'        => __("Update Image", 'acf'),
                'uploadedTo'    => __("Uploaded to this post", 'acf'),
                'all'            => __("All images", 'acf'),
            );
            add_filter('get_media_item_args',                array($this, 'get_media_item_args'));
            add_filter('wp_prepare_attachment_for_js',        array($this, 'wp_prepare_attachment_for_js'), 10, 3);
            add_action('admin_head', array($this, 'AddScript'));
            parent::__construct();
        }
        public function AddScript()
        {
?>
            <script>
                ! function(a) {
                    acf.fields.image = acf.field.extend({
                        type: "image_center",
                        $el: null,
                        actions: {
                            ready: "initialize",
                            append: "initialize"
                        },
                        events: {
                            'click a[data-name="add"]': "add",
                            'click a[data-name="edit"]': "edit",
                            'click a[data-name="remove"]': "remove",
                            "click .acf-imgcnt-layover": "center",
                            "mouseup .acf-imgcnt-layover": "center",
                            'change input[type="file"]': "change"
                        },
                        focus: function() {
                            this.$el = this.$field.find(".acf-image-uploader"), this.o = acf.get_data(this.$el)
                        },
                        initialize: function() {
                            this.$el.hasClass("basic") && this.$el.closest("form").attr("enctype", "multipart/form-data")
                        },
                        center: function(a) {
                            var b = this.$el.offset(),
                                c = (a.pageX - b.left) / this.$el.find("img[data-name=image]").width() * 100,
                                d = (a.pageY - b.top) / this.$el.find("img[data-name=image]").height() * 100;
                            courl = "x=" + c + "&y=" + d, this.$el.closest(".acf-field").find("img.acf-imgcnt-arrow").css({
                                left: c + "%",
                                top: d + "%"
                            }), this.$el.closest(".acf-field").find('[data-name="top"]').val(d).trigger("change"), this.$el.closest(".acf-field").find('[data-name="left"]').val(c).trigger("change")
                        },
                        add: function() {
                            var b = this,
                                c = this.$field,
                                d = acf.get_closest_field(this.$field, "repeater");
                            acf.media.popup({
                                title: acf._e("image", "select"),
                                mode: "select",
                                type: "image",
                                field: acf.get_field_key(c),
                                multiple: d.exists(),
                                library: this.o.library,
                                mime_types: this.o.mime_types,
                                select: function(e, f) {
                                    if (f > 0) {
                                        var g = acf.get_field_key(c),
                                            h = c.closest(".acf-row");
                                        if (c = !1, h.nextAll(".acf-row:visible").each(function() {
                                                if (c = acf.get_field(g, a(this))) return !!c.find(".acf-image-uploader.has-value").exists() && void(c = !1)
                                            }), !c) {
                                            if (h = acf.fields.repeater.doFocus(d).add(), !h) return !1;
                                            c = acf.get_field(g, h)
                                        }
                                    }
                                    b.doFocus(c), b.render(b.prepare(e))
                                }
                            })
                        },
                        prepare: function(a) {
                            var b = {
                                id: a.id,
                                url: a.attributes.url
                            };
                            return acf.isset(a.attributes, "sizes", this.o.preview_size, "url") && (b.url = a.attributes.sizes[this.o.preview_size].url), b
                        },
                        render: function(a) {
                            this.$el.find('[data-name="image"]').attr("src", a.url), this.$el.find('[data-name="id"]').val(a.id).trigger("change"), this.$el.addClass("has-value")
                        },
                        edit: function() {
                            var a = this,
                                b = this.$el.find('[data-name="id"]').val();
                            acf.media.popup({
                                title: acf._e("image", "edit"),
                                button: acf._e("image", "update"),
                                mode: "edit",
                                id: b,
                                select: function(b, c) {
                                    a.render(a.prepare(b))
                                }
                            })
                        },
                        remove: function() {
                            var a = {
                                id: "",
                                url: ""
                            };
                            this.render(a), this.$el.removeClass("has-value")
                        },
                        change: function(a) {
                            this.$el.find('[data-name="id"]').val(a.$el.val())
                        }
                    })
                }(jQuery);
            </script><?php
                    }
                    function render_field($field)
                    {
                        $uploader = acf_get_setting('uploader');
                        if ($uploader == 'wp') {
                            acf_enqueue_uploader();
                        }
                        $url = '';
                        $div = array(
                            'class'                    => 'acf-image-uploader acf-cf',
                            'data-preview_size'        => 'full',
                            'data-library'            => $field['library'],
                            'data-mime_types'        => $field['mime_types'],
                            'data-uploader'            => $uploader
                        );

                        if ($field['value'] && is_numeric($field['value']['id'])) {
                            $url = wp_get_attachment_image_src($field['value']['id'], 'full');
                            if ($url) {
                                $url = $url[0];
                                $div['class'] .= ' has-value';
                            }
                        }
                        ?>
            <div <?php acf_esc_attr_e($div); ?>>
                <div class="acf-hidden">
                    <?php acf_hidden_input(array('name' => $field['name'] . '[id]', 'value' => $field['value']['id'], 'data-name' => 'id')); ?>
                    <?php acf_hidden_input(array('name' => $field['name'] . '[top]', 'value' => $field['value']['top'], 'data-name' => 'top')); ?>
                    <?php acf_hidden_input(array('name' => $field['name'] . '[left]', 'value' => $field['value']['left'], 'data-name' => 'left')); ?>
                </div>
                <div class="view show-if-value acf-soh">
                    <div class="acf-imgcnt-layover">
                        <img data-name="image" src="<?php echo $url; ?>" alt="" style="max-width: 100%;">
                        <img class="acf-imgcnt-arrow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAP0lEQVR4Ae3MwQGAIBDEwFSz/XcYG1AFRF87vOCO8EDlwQ+BBhqIoZ54JpwJnpzTx3DCeIInZQhvKP4QaKCBA66AfLXs2eyzAAAAAElFTkSuQmCC" style="top: <?php echo (isset($field['value']['top'])) ? $field['value']['top'] : 50;  ?>%; left: <?php echo (isset($field['value']['left'])) ? $field['value']['left'] : 50;  ?>%">
                    </div>
                    <ul class="acf-hl acf-soh-target">
                        <?php if ($uploader != 'basic') : ?>
                            <li><a class="acf-icon acf-icon -pencil dark" data-name="edit" href="#"></a></li>
                        <?php endif; ?>
                        <li><a class="acf-icon acf-icon -cancel dark" data-name="remove" href="#"></a></li>
                    </ul>
                </div>
                <div class="view hide-if-value">
                    <?php if ($uploader == 'basic') : ?>
                        <?php if ($field['value'] && !is_numeric($field['value'])) : ?>
                            <div class="acf-error-message">
                                <p><?php echo $field['value']; ?></p>
                            </div>
                        <?php endif; ?>
                        <input type="file" name="<?php echo $field['name']; ?>" id="<?php echo $field['id']; ?>" />
                    <?php else : ?>
                        <p style="margin:0;"><?php _e('No image selected', 'acf'); ?> <a data-name="add" class="acf-button button" href="#"><?php _e('Add Image', 'acf'); ?></a></p>
                    <?php endif; ?>
                </div>
                <style>
                    .acf-imgcnt-layover {
                        position: relative;
                        display: inline-block;
                        cursor: pointer;
                        width: auto;
                    }

                    .acf-field-image-center .acf-image-uploader {
                        display: inline-block;
                    }

                    .acf-field-image-center .acf-soh-target {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                    }

                    .acf-image-uploader img.acf-imgcnt-arrow {
                        width: 32px !important;
                        height: 32px !important;
                        margin-left: -16px;
                        position: absolute;
                        margin-top: -16px;
                        top: 50%;
                        left: 50%;
                        z-index: 1000;
                        background: transparent;
                    }
                </style>
            </div>
<?php
                    }
                    function render_field_settings($field)
                    {
                        $clear = array(
                            'min_width',
                            'min_height',
                            'min_size',
                            'max_width',
                            'max_height',
                            'max_size'
                        );
                        foreach ($clear as $k) {
                            if (empty($field[$k])) {
                                $field[$k] = '';
                            }
                        }
                        // library
                        acf_render_field_setting($field, array(
                            'label'            => __('Library', 'acf'),
                            'instructions'    => __('Limit the media library choice', 'acf'),
                            'type'            => 'radio',
                            'name'            => 'library',
                            'layout'        => 'horizontal',
                            'choices'         => array(
                                'all'            => __('All', 'acf'),
                                'uploadedTo'    => __('Uploaded to post', 'acf')
                            )
                        ));
                        acf_render_field_setting($field, array(
                            'label'            => __('Minimum', 'acf'),
                            'instructions'    => __('Restrict which images can be uploaded', 'acf'),
                            'type'            => 'text',
                            'name'            => 'min_width',
                            'prepend'        => __('Width', 'acf'),
                            'append'        => 'px',
                        ));
                        acf_render_field_setting($field, array(
                            'label'            => '',
                            'type'            => 'text',
                            'name'            => 'min_height',
                            'prepend'        => __('Height', 'acf'),
                            'append'        => 'px',
                            'wrapper'        => array(
                                'data-append' => 'min_width'
                            )
                        ));
                        acf_render_field_setting($field, array(
                            'label'            => '',
                            'type'            => 'text',
                            'name'            => 'min_size',
                            'prepend'        => __('File size', 'acf'),
                            'append'        => 'MB',
                            'wrapper'        => array(
                                'data-append' => 'min_width'
                            )
                        ));

                        // max
                        acf_render_field_setting($field, array(
                            'label'            => __('Maximum', 'acf'),
                            'instructions'    => __('Restrict which images can be uploaded', 'acf'),
                            'type'            => 'text',
                            'name'            => 'max_width',
                            'prepend'        => __('Width', 'acf'),
                            'append'        => 'px',
                        ));
                        acf_render_field_setting($field, array(
                            'label'            => '',
                            'type'            => 'text',
                            'name'            => 'max_height',
                            'prepend'        => __('Height', 'acf'),
                            'append'        => 'px',
                            'wrapper'        => array(
                                'data-append' => 'max_width'
                            )
                        ));
                        acf_render_field_setting($field, array(
                            'label'            => '',
                            'type'            => 'text',
                            'name'            => 'max_size',
                            'prepend'        => __('File size', 'acf'),
                            'append'        => 'MB',
                            'wrapper'        => array(
                                'data-append' => 'max_width'
                            )
                        ));
                        acf_render_field_setting($field, array(
                            'label'            => __('Allowed file types', 'acf'),
                            'instructions'    => __('Comma separated list. Leave blank for all types', 'acf'),
                            'type'            => 'text',
                            'name'            => 'mime_types',
                        ));
                    }
                    function format_value($value, $post_id, $field)
                    {
                        if ($value['id']) {
                            $image = acf_get_attachment($value['id']);
                            $image['top'] = ($value['top'] !== '') ? $value['top'] : 50;
                            $image['left'] = ($value['left'] !== '') ? $value['left'] : 50;
                            return $image;
                        } else return false;
                    }
                    function get_media_item_args($vars)
                    {
                        $vars['send'] = true;
                        return ($vars);
                    }
                    function wp_prepare_attachment_for_js($response, $attachment, $meta)
                    {
                        if ($response['type'] != 'image') {
                            return $response;
                        }
                        if (!isset($meta['sizes'])) {
                            return $response;
                        }
                        $attachment_url = $response['url'];
                        $base_url = str_replace(wp_basename($attachment_url), '', $attachment_url);
                        if (isset($meta['sizes']) && is_array($meta['sizes'])) {
                            foreach ($meta['sizes'] as $k => $v) {
                                if (!isset($response['sizes'][$k])) {
                                    $response['sizes'][$k] = array(
                                        'height'      => $v ? $v['height'] : null,
                                        'width'       => $v ? $v['width'] : null,
                                        'url'         => $base_url .  $v['file'],
                                        'orientation' => $v['height'] > $v['width'] ? 'portrait' : 'landscape',
                                    );
                                }
                            }
                        }
                        return $response;
                    }
                    function update_value($value, $post_id, $field)
                    {
                        if (is_array($value) && isset($value['ID'])) {
                            $value['top'] = ($value['top'] !== '') ? $value['top'] : 50;
                            $value['left'] = ($value['left'] !== '') ? $value['left'] : 50;
                            return array('id' => intval($value['ID']), 'top' => floatval($top), 'left' => floatval($left));
                        }
                        if (is_object($value) && isset($value->ID)) {
                            $top = ($value->top !== '') ? $value->top : 50;
                            $left = ($value->left !== '') ? $value->left : 50;
                            return array('id' => intval($value->id), 'top' => floatval($top), 'left' => floatval($left));
                        }
                        return $value;
                    }
                }
                new acf_field_image_center();
            }
