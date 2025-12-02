<?php
/**
 * QahwaWorld functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package QahwaWorld
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

if ( ! defined( 'NEXTJS_FRONTEND_URL' ) ) {
	// Next.js frontend URL - change this to your production URL when deploying
	define( 'NEXTJS_FRONTEND_URL', 'http://localhost:3000' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function qahwaworld_wp_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on QahwaWorld, use a find and replace
		* to change 'qahwaworld-wp' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'qahwaworld-wp', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'primary' => esc_html__( 'Main Menu', 'qahwaworld-wp' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'qahwaworld_wp_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'qahwaworld_wp_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function qahwaworld_wp_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'qahwaworld_wp_content_width', 640 );
}
add_action( 'after_setup_theme', 'qahwaworld_wp_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function qahwaworld_wp_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'qahwaworld-wp' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'qahwaworld-wp' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'qahwaworld_wp_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function qahwaworld_wp_scripts() {
	wp_enqueue_style( 'qahwaworld-wp-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'qahwaworld-wp-style', 'rtl', 'replace' );

	wp_enqueue_script( 'qahwaworld-wp-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'qahwaworld_wp_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';


/**
 * Revalidation for nextjs additions.
 */
//require get_template_directory() . '/inc/revalidate.php';


/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * change post order for acf relation field
 * */
add_filter('acf/fields/relationship/query/name=select_trending_posts', 'acf_sort_relationship_new_to_old', 10, 3);
function acf_sort_relationship_new_to_old($args, $field, $post_id) {
    $args['orderby'] = 'date';
    $args['order'] = 'DESC'; // newest → oldest
    return $args;
}

/**
 * Disable Gutenberg Completely
 */
add_filter('use_block_editor_for_post_type', '__return_false', 100);

add_filter('use_block_editor_for_post', '__return_false', 100);

// Disable block editor for widgets
add_filter('gutenberg_use_widgets_block_editor', '__return_false');
add_filter('use_widgets_block_editor', '__return_false');

// Remove block editor scripts/styles
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wp-block-style');
}, 100);
add_action('admin_init', function () {
    remove_action('admin_print_styles', 'gutenberg_block_editor_admin_styles');
});
add_filter('excerpt_more', '__return_empty_string');

/**
 * Send Trending Posts from home page in GraphQL
 */
add_action('graphql_register_types', function () {

    register_graphql_object_type('TrendingPostData', [
        'description' => 'Custom trending post data',
        'fields' => [
            'id' => ['type' => 'Int'],
            'title' => ['type' => 'String'],
            'slug' => ['type' => 'String'],
            'excerpt' => ['type' => 'String'],
            'featuredImage' => ['type' => 'String'],
            'categories' => [
                'type' => ['list_of' => 'CategoryData']
            ],
            'url' => ['type' => 'String'],
            'date' => ['type' => 'String'],
            'readingTime' => ['type' => 'Int'],
        ]
    ]);

    register_graphql_object_type('CategoryData', [
        'fields' => [
            'name' => ['type' => 'String'],
            'slug' => ['type' => 'String']
        ]
    ]);

    register_graphql_field('RootQuery', 'trendingPosts', [
        'type' => ['list_of' => 'TrendingPostData'],
        'args' => [
            'language' => ['type' => 'String']
        ],

        'resolve' => function ($root, $args) {

            $lang = $args['language'] ?? 'en';

            $default_front = intval(get_option('page_on_front'));
            if (!$default_front) return [];

            $translated_id = apply_filters(
                'wpml_object_id',
                $default_front,
                'page',
                true,
                $lang
            );

            if (!$translated_id) return [];

            $post_ids = get_field('select_trending_posts', $translated_id);
            if (!is_array($post_ids)) return [];

            $final = [];

            foreach ($post_ids as $id) {
                $post = get_post($id);
                if (!$post) continue;

                // --------------------------
                // Calculate Reading Tim
                // --------------------------
                $content = strip_tags($post->post_content);
                preg_match_all('/\p{L}+/u', $content, $matches);
				$word_count = count($matches[0]);

				$reading_time = ceil($word_count / 50);
                // --------------------------

                // Get categories of the post
                $terms = get_the_terms($post->ID, 'category') ?: [];
                $filtered_cats = [];

                foreach ($terms as $term) {
                    $translated_term_id = apply_filters(
                        'wpml_object_id',
                        $term->term_id,
                        'category',
                        true,
                        $lang
                    );

                    if ($translated_term_id == $term->term_id) {
                        $filtered_cats[] = [
                            'name' => $term->name,
                            'slug' => $term->slug
                        ];
                    }
                }

                $final[] = [
                    'id' => $post->ID,
                    'title' => get_the_title($post->ID),
                    'slug' => $post->post_name,
                    'excerpt' => wp_trim_words(strip_tags(get_the_excerpt($post->ID)), 30),
                    'featuredImage' => get_the_post_thumbnail_url($post->ID, 'full'),
                    'categories' => $filtered_cats,
                    'url' => get_permalink($post->ID),
                    'date' => get_the_date('Y-m-d H:i:s', $post->ID),
                    'readingTime' => $reading_time,
                ];
            }

            return $final;
        }
    ]);
});


/**
 * sent homepage categories data in graphql
 * */
add_action('graphql_register_types', function () {

    register_graphql_object_type('CategoryPostItem', [
        'description' => 'Latest posts inside category section',
        'fields' => [
            'id' => ['type' => 'Int'],
            'title' => ['type' => 'String'],
            'slug' => ['type' => 'String'],
            'featuredImage' => ['type' => 'String'],
            'date' => ['type' => 'String'],
            'readingTime' => ['type' => 'Int'],
        ]
    ]);

    register_graphql_object_type('SectionCategoryData', [
        'description' => 'Category details',
        'fields' => [
            'id' => ['type' => 'Int'],
            'name' => ['type' => 'String'],
            'slug' => ['type' => 'String']
        ]
    ]);

    register_graphql_object_type('CategorySectionItem', [
        'description' => 'Category section with repeater data',
        'fields' => [
            'sectionTitle' => ['type' => 'String'],
            'sectionBackgroundColor' => ['type' => 'String'],
            'viewAllButtonLabel' => ['type' => 'String'],
            'viewAllButtonUrl' => ['type' => 'String'],
            'category' => ['type' => 'SectionCategoryData'],
            'posts' => ['type' => ['list_of' => 'CategoryPostItem']]
        ]
    ]);

    register_graphql_field('RootQuery', 'getCategorySectionData', [
        'type' => ['list_of' => 'CategorySectionItem'],
        'args' => [
            'language' => ['type' => 'String']
        ],
        'resolve' => function ($root, $args) {

            $lang = $args['language'] ?? 'en';

            $front_id = intval(get_option('page_on_front'));
            if (!$front_id) return [];

            $translated_id = apply_filters('wpml_object_id', $front_id, 'page', true, $lang);
            if (!$translated_id) return [];

            $rows = get_field('add_category_section', $translated_id);
            if (!$rows || !is_array($rows)) return [];

            $final = [];

            foreach ($rows as $row) {

                $cat_data = null;
                $posts_data = [];
                $cat_id = intval($row['category']);

                if ($cat_id) {

                    $translated_cat_id = apply_filters(
                        'wpml_object_id',
                        $cat_id,
                        'category',
                        true,
                        $lang
                    );

                    $term = get_term($translated_cat_id);

                    if ($term && !is_wp_error($term)) {

                        $cat_data = [
                            'id' => $term->term_id,
                            'name' => $term->name,
                            'slug' => $term->slug
                        ];

                        $query = new WP_Query([
                            'post_type' => 'post',
                            'posts_per_page' => 4,
                            'tax_query' => [
                                [
                                    'taxonomy' => 'category',
                                    'field' => 'term_id',
                                    'terms' => $term->term_id
                                ]
                            ]
                        ]);

                        if ($query->have_posts()) {
                            while ($query->have_posts()) {
                                $query->the_post();

                                $original_post_id = get_the_ID();

                                // Get translated post ID
                                $translated_post_id = apply_filters(
                                    'wpml_object_id',
                                    $original_post_id,
                                    'post',
                                    true,
                                    $lang
                                );

                                if ($translated_post_id) {
                                    $post_id = $translated_post_id;
                                } else {
                                    $post_id = $original_post_id;
                                }

                                $content = strip_tags(get_post_field('post_content', $post_id));
                                preg_match_all('/\p{L}+/u', $content, $matches);
                                $word_count = count($matches[0]);
                                $reading_time = ceil($word_count / 50);

                                $posts_data[] = [
                                    'id' => $post_id,
                                    'title' => get_the_title($post_id),
                                    'slug' => get_post_field('post_name', $post_id),
                                    'featuredImage' => get_the_post_thumbnail_url($post_id, 'full'),
                                    'date' => get_the_date('Y-m-d H:i:s', $post_id),
                                    'readingTime' => $reading_time
                                ];
                            }
                            wp_reset_postdata();
                        }
                    }
                }

                $final[] = [
                    'sectionTitle' => $row['section_title'] ?? '',
                    'sectionBackgroundColor' => $row['section_background_color'] ?? '',
                    'viewAllButtonLabel' => $row['view_all_button_label'] ?? '',
                    'viewAllButtonUrl' => $row['view_all_button_url'] ?? '',
                    'category' => $cat_data,
                    'posts' => $posts_data,
                ];
            }

            return $final;
        }
    ]);
});


/**
 * Get spotlight data in graphql
 * */
add_action('graphql_register_types', function () {

    register_graphql_object_type('SpotlightPostCategory', [
        'fields' => [
            'id' => ['type' => 'Int'],
            'name' => ['type' => 'String'],
            'slug' => ['type' => 'String']
        ]
    ]);

    register_graphql_object_type('SpotlightPostItem', [
        'fields' => [
            'id' => ['type' => 'Int'],
            'title' => ['type' => 'String'],
            'slug' => ['type' => 'String'],
            'featuredImage' => ['type' => 'String'],
			'excerpt' => ['type' => 'String'],
            'date' => ['type' => 'String'],
            'readingTime' => ['type' => 'Int'],
            'author' => ['type' => 'String'],
            'categories' => ['type' => ['list_of' => 'SpotlightPostCategory']]
        ]
    ]);

    register_graphql_object_type('SpotlightCategory', [
        'fields' => [
            'id' => ['type' => 'Int'],
            'name' => ['type' => 'String'],
            'slug' => ['type' => 'String']
        ]
    ]);

    register_graphql_object_type('SpotlightData', [
        'fields' => [
            'sectionTitle' => ['type' => 'String'],
            'image' => ['type' => 'String'],
            'title' => ['type' => 'String'],
            'description' => ['type' => 'String'],
            'buttonLabel' => ['type' => 'String'],
            'buttonLink' => ['type' => 'String'],
            'category' => ['type' => 'SpotlightCategory'],
            'posts' => ['type' => ['list_of' => 'SpotlightPostItem']]
        ]
    ]);

    register_graphql_field('RootQuery', 'getSpotlightData', [
        'type' => 'SpotlightData',
        'args' => [
            'language' => ['type' => 'String']
        ],
        'resolve' => function ($root, $args) {

            $lang = $args['language'] ?? 'en';

            $front_id = intval(get_option('page_on_front'));
            if (!$front_id) return null;

            $translated_id = apply_filters('wpml_object_id', $front_id, 'page', true, $lang);
            if (!$translated_id) return null;

            $section_title = get_field('spotlight_section_title', $translated_id);
            $image = get_field('spotlight_image', $translated_id);
            $title = get_field('spotlight_title', $translated_id);
            $description = get_field('spotlight_description', $translated_id);
            $button_label = get_field('spotlight_button_label', $translated_id);
            $button_link = get_field('spotlight_button_link', $translated_id);
            $cat_id = get_field('select_spotlight_category', $translated_id);

            $category_data = null;
            $posts_data = [];

            if ($cat_id) {

                $translated_cat_id = apply_filters(
                    'wpml_object_id',
                    intval($cat_id),
                    'category',
                    true,
                    $lang
                );

                $term = get_term($translated_cat_id);

                if ($term && !is_wp_error($term)) {

                    $category_data = [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug
                    ];

                    $query = new WP_Query([
                        'post_type' => 'post',
                        'posts_per_page' => 4,
                        'tax_query' => [
                            [
                                'taxonomy' => 'category',
                                'field' => 'term_id',
                                'terms' => $term->term_id
                            ]
                        ]
                    ]);

                    if ($query->have_posts()) {
                        while ($query->have_posts()) {
                            $query->the_post();

                            $original_post_id = get_the_ID();

                            $translated_post_id = apply_filters(
                                'wpml_object_id',
                                $original_post_id,
                                'post',
                                true,
                                $lang
                            );

                            $post_id = $translated_post_id ?: $original_post_id;

                            $terms = get_the_terms($post_id, 'category') ?: [];
                            $cat_list = [];

                            $cat_list = [
								[
									'id' => $term->term_id,
									'name' => $term->name,
									'slug' => $term->slug
								]
							];

                            $content = strip_tags(get_post_field('post_content', $post_id));
                            preg_match_all('/\p{L}+/u', $content, $m);
                            $word_count = count($m[0]);
                            $reading_time = ceil($word_count / 50);

                            $posts_data[] = [
                                'id' => $post_id,
                                'title' => get_the_title($post_id),
                                'slug' => get_post_field('post_name', $post_id),
								'excerpt' => wp_trim_words(strip_tags(get_the_excerpt($post_id)), 30),
                                'featuredImage' => get_the_post_thumbnail_url($post_id, 'full'),
                                'date' => get_the_date('Y-m-d H:i:s', $post_id),
                                'readingTime' => $reading_time,
                                'author' => get_the_author_meta('display_name', get_post_field('post_author', $post_id)),
                                'categories' => $cat_list
                            ];
                        }
                        wp_reset_postdata();
                    }
                }
            }

            return [
                'sectionTitle' => $section_title,
                'image' => is_array($image) ? $image['url'] : $image,
                'title' => $title,
                'description' => $description,
                'buttonLabel' => $button_label,
                'buttonLink' => $button_link,
                'category' => $category_data,
                'posts' => $posts_data
            ];
        }
    ]);
});

/**
 * Send data for home page ad banner in graphql
 * */
add_action('graphql_register_types', function () {

    register_graphql_object_type('HomepageAdBannerItem', [
        'fields' => [
            'name' => ['type' => 'String'],
            'content' => ['type' => 'String']
        ]
    ]);

    register_graphql_field('RootQuery', 'getHomepageAdBanner', [
        'type' => ['list_of' => 'HomepageAdBannerItem'],
        'resolve' => function () {

            $fields = [
                'home_page_ad1',
                'home_page_ad2',
                'home_page_ad3',
                'home_page_ad4',
                'home_page_ad5',
				'post_ad',
				'category_ad',
				'tag_ad',
				'author_ad'
            ];

            $ads = [];

            foreach ($fields as $field) {

                $value = get_field($field, 'option'); // ACF option field

                if (!empty($value)) {
                    $ads[] = [
                        'name' => $field,
                        'content' => $value
                    ];
                }
            }

            return $ads;
        }
    ]);
});

/**
 * send about page content in graphql
 * */

add_action('graphql_register_types', function () {

    // Value item inside repeater
    register_graphql_object_type('AboutValueItem', [
        'fields' => [
            'iconClass' => ['type' => 'String'],
            'heading' => ['type' => 'String'],
            'description' => ['type' => 'String'],
        ]
    ]);

    // Main About Page Data
    register_graphql_object_type('AboutPageData', [
        'fields' => [
            'heroHeading' => ['type' => 'String'],
            'heroSubHeading' => ['type' => 'String'],
            'heroBackgroundColor' => ['type' => 'String'],

            'missionHeading' => ['type' => 'String'],
            'missionDescription' => ['type' => 'String'],
            'missionImage' => ['type' => 'String'],

            'visionHeading' => ['type' => 'String'],
            'visionDescription' => ['type' => 'String'],
            'visionImage' => ['type' => 'String'],

            'valuesHeading' => ['type' => 'String'],
            'values' => ['type' => ['list_of' => 'AboutValueItem']]
        ]
    ]);

    register_graphql_field('RootQuery', 'getAboutPageData', [
        'type' => 'AboutPageData',
        'args' => [
            'language' => ['type' => 'String']
        ],
        'resolve' => function($root, $args) {

            $lang = $args['language'] ?? 'en';

            // Find About Page ID (backend About page)
            $about_page_id = apply_filters('wpml_object_id', 25, 'page', true, $lang);

            if (!$about_page_id) {
                return null;
            }

            // ACF Fields
            $hero_heading     = get_field('hero_section_heading_about', $about_page_id);
            $hero_sub_heading = get_field('hero_section_sub_heading_about', $about_page_id);
            $hero_bg_color    = get_field('hero_section_background_color_about', $about_page_id);

            // Mission
            $mission_heading    = get_field('heading_mission', $about_page_id);
            $mission_desc       = get_field('description_mission', $about_page_id);
            $mission_image      = get_field('image_mission', $about_page_id);
            $mission_image_url  = is_array($mission_image) ? $mission_image['url'] : $mission_image;

            // Vision
            $vision_heading   = get_field('heading_vision', $about_page_id);
            $vision_desc      = get_field('description_vision', $about_page_id);
            $vision_image     = get_field('image_vision', $about_page_id);
            $vision_image_url = is_array($vision_image) ? $vision_image['url'] : $vision_image;

            // Values Section
            $values_heading = get_field('section_heading_our_values', $about_page_id);
            $values_rows    = get_field('add_our_values', $about_page_id);

            $values_list = [];

            if (!empty($values_rows) && is_array($values_rows)) {
                foreach ($values_rows as $row) {
                    $values_list[] = [
                        'iconClass'   => $row['icon_class_our_values'] ?? '',
                        'heading'     => $row['heading_our_values'] ?? '',
                        'description' => $row['description_our_values'] ?? '',
                    ];
                }
            }

            return [
                'heroHeading'         => $hero_heading,
                'heroSubHeading'      => $hero_sub_heading,
                'heroBackgroundColor' => $hero_bg_color,

                'missionHeading'    => $mission_heading,
                'missionDescription' => $mission_desc,
                'missionImage'       => $mission_image_url,

                'visionHeading'       => $vision_heading,
                'visionDescription'   => $vision_desc,
                'visionImage'         => $vision_image_url,

                'valuesHeading' => $values_heading,
                'values'        => $values_list
            ];
        }
    ]);

});


/**
 * sent privacy policy data into graphql
 * */
add_action('graphql_register_types', function () {

    // Repeater Block item
    register_graphql_object_type('PrivacyContentBlock', [
        'fields' => [
            'iconClass' => ['type' => 'String'],
            'heading' => ['type' => 'String'],
            'description' => ['type' => 'String'],
        ]
    ]);

    // Main Privacy Page Data
    register_graphql_object_type('PrivacyPageData', [
        'fields' => [
            'heroHeading' => ['type' => 'String'],
            'heroBgColor' => ['type' => 'String'],
            'content' => ['type' => 'String'],

            'blocks' => ['type' => ['list_of' => 'PrivacyContentBlock']],

            'contactHeading' => ['type' => 'String'],
            'contactDescription' => ['type' => 'String'],
			'lastUpdated' => ['type' => 'String'],
        ]
    ]);

    register_graphql_field('RootQuery', 'getPrivacyPolicyPageData', [
        'type' => 'PrivacyPageData',
        'args' => [
            'language' => ['type' => 'String']
        ],
        'resolve' => function($root, $args) {

            $lang = $args['language'] ?? 'en';

            // TODO: Add your main Privacy Policy Page ID
            $privacy_page_id = 23; 

            // WPML translate page ID
            $translated_id = apply_filters(
                'wpml_object_id',
                $privacy_page_id,
                'page',
                true,
                $lang
            );

            if (!$translated_id) return null;

            // Hero Section
            $hero_heading = get_field('hero_section_heading_privacy', $translated_id);
            $hero_bg_color = get_field('hero_section_bg_color_privacy', $translated_id);

            // Main Content
            $content_text = get_field('content_privacy', $translated_id);

            // Add Content Blocks (Repeater)
            $repeater_rows = get_field('add_content_privacy', $translated_id);
            $blocks = [];

            if (!empty($repeater_rows) && is_array($repeater_rows)) {
                foreach ($repeater_rows as $row) {
                    $blocks[] = [
                        'iconClass' => $row['icon_class_privacy'] ?? '',
                        'heading' => $row['heading_privacy'] ?? '',
                        'description' => $row['description_privacy'] ?? '',
                    ];
                }
            }

            // Contact Section
            $contact_heading = get_field('heading_contact_privacy', $translated_id);
            $contact_desc = get_field('description_contact_privacy', $translated_id);
			$last_updated = get_post_modified_time('Y-m-d H:i:s', false, $translated_id);

            return [
                'heroHeading' => $hero_heading,
                'heroBgColor' => $hero_bg_color,
                'content' => $content_text,
                'blocks' => $blocks,
                'contactHeading' => $contact_heading,
                'contactDescription' => $contact_desc,
				'lastUpdated' => $last_updated
            ];
        }
    ]);
});


/*
GraphQL Resolver: getContactPageData
Fetches ACF fields from Contact Page (multi-language via WPML)
*/
add_action('graphql_register_types', function () {

    register_graphql_object_type('ContactPageData', [
        'fields' => [
            'contactBlockHeading' => ['type' => 'String'],
            'emailLabel' => ['type' => 'String'],
            'emailAddress' => ['type' => 'String'],
            'phoneLabel' => ['type' => 'String'],
            'phoneNumber' => ['type' => 'String'],
            'addressLabel' => ['type' => 'String'],
            'address' => ['type' => 'String'],
            'description' => ['type' => 'String'],
            'formId' => ['type' => 'String'],
        ]
    ]);

    register_graphql_field('RootQuery', 'getContactPageData', [
        'type' => 'ContactPageData',
        'args' => [
            'language' => ['type' => 'String']
        ],

        /*  
           Resolve ACF fields from Contact Page  
           Uses WPML to load correct translated page  
        */
        'resolve' => function ($root, $args) {

            $lang = $args['language'] ?? 'en';

            // Replace 123 with your Contact Page ID
            $contact_page_id = apply_filters(
                'wpml_object_id',
                20557,
                'page',
                true,
                $lang
            );

            if (!$contact_page_id) {
                return null;
            }

            return [
                'contactBlockHeading' => get_field('contact_block_heading', $contact_page_id),
                'emailLabel' => get_field('email_label', $contact_page_id),
                'emailAddress' => get_field('email_address', $contact_page_id),
                'phoneLabel' => get_field('phone_label', $contact_page_id),
                'phoneNumber' => get_field('phone_number', $contact_page_id),
                'addressLabel' => get_field('address_label', $contact_page_id),
                'address' => get_field('address', $contact_page_id),
                'description' => get_field('description', $contact_page_id),
                'formId' => get_field('form_id', $contact_page_id),
            ];
        }
    ]);

});



/*  
   GraphQL Resolver: getAuthorPostCountBySlug  
   Returns total number of posts for a given author slug  
   Finds author by slug and calculates total published posts  
*/
add_action('graphql_register_types', function () {

    register_graphql_object_type('AuthorPostCountData', [
        'fields' => [
            'count' => ['type' => 'Int']
        ]
    ]);

    register_graphql_field('RootQuery', 'getAuthorPostCountBySlug', [
        'type' => 'AuthorPostCountData',
        'args' => [
            'authorSlug' => ['type' => 'String']
        ],

        'resolve' => function ($root, $args) {

            $slug = $args['authorSlug'] ?? '';

            if (!$slug) {
                return ['count' => 0];
            }

            // Find author by slug
            $author = get_user_by('slug', $slug);

            if (!$author) {
                return ['count' => 0];
            }

            // Get total posts by found author
            $count = count(
                get_posts([
                    'post_type' => 'post',
                    'post_status' => 'publish',
                    'author' => $author->ID,
                    'posts_per_page' => -1,
                    'fields' => 'ids'
                ])
            );

            return [
                'count' => $count
            ];
        }
    ]);

});




/*
GraphQL Resolver: getFaqPageData
Returns FAQ Page Data language-wise using WPML
Includes Hero Content, FAQs repeater, and CTA block
*/

add_action('graphql_register_types', function () {

    // FAQ Single Item inside repeater
    register_graphql_object_type('FaqItem', [
        'fields' => [
            'question' => ['type' => 'String'],
            'answer' => ['type' => 'String'],
        ]
    ]);

    // Main FAQ Page Data
    register_graphql_object_type('FaqPageData', [
        'fields' => [
            'heroHeading' => ['type' => 'String'],
            'heroSubHeading' => ['type' => 'String'],

            'faqs' => ['type' => ['list_of' => 'FaqItem']],

            'ctaHeading' => ['type' => 'String'],
            'ctaSubHeading' => ['type' => 'String'],
            'ctaButtonText' => ['type' => 'String'],
            'ctaButtonLink' => ['type' => 'String'],
        ]
    ]);

    register_graphql_field('RootQuery', 'getFaqPageData', [
        'type' => 'FaqPageData',
        'args' => [
            'language' => ['type' => 'String']
        ],

        /*  
           Resolve ACF fields from FAQ Page  
           Uses WPML to load correct translated page  
        */
        'resolve' => function ($root, $args) {

            $lang = $args['language'] ?? 'en';

            // Replace PAGE_ID with your FAQ Page ID
            $faq_page_id = apply_filters(
                'wpml_object_id',
                20592, 
                'page',
                true,
                $lang
            );

            if (!$faq_page_id) {
                return null;
            }

            // Hero Section
            $hero_heading = get_field('hero_heading_faq', $faq_page_id);
            $hero_sub_heading = get_field('hero_sub_heading_faq', $faq_page_id);

            // FAQs Repeater
            $faq_rows = get_field('add_faqs', $faq_page_id);
            $faq_list = [];

            if (!empty($faq_rows) && is_array($faq_rows)) {
                foreach ($faq_rows as $item) {
                    $faq_list[] = [
                        'question' => $item['add_question_faq'] ?? '',
                        'answer' => $item['add_answer_faq'] ?? ''
                    ];
                }
            }

            // CTA Block
            $cta_heading = get_field('heading_cta_block', $faq_page_id);
            $cta_sub_heading = get_field('sub_heading_cta_block', $faq_page_id);
            $cta_button_text = get_field('cta_button_text', $faq_page_id);
            $cta_button_link = get_field('cta_button_link', $faq_page_id);

            return [
                'heroHeading' => $hero_heading,
                'heroSubHeading' => $hero_sub_heading,

                'faqs' => $faq_list,

                'ctaHeading' => $cta_heading,
                'ctaSubHeading' => $cta_sub_heading,
                'ctaButtonText' => $cta_button_text,
                'ctaButtonLink' => $cta_button_link
            ];
        }
    ]);

});



/**
 * Build frontend URL with language prefix using post slug
 * */

function headless_get_frontend_url_generic($post) {

    // Detect post language (WPML)
    $lang_details = apply_filters('wpml_post_language_details', null, $post->ID);
    $lang = $lang_details['language_code'] ?? 'en';

    // Build language prefix
    $prefix = ($lang === 'en') ? '' : $lang . '/';

    // PAGES → /lang/page-slug
    if ($post->post_type === 'page') {
        return NEXTJS_FRONTEND_URL . "/" . $prefix . $post->post_name;
    }

    // POSTS → /lang/category-slug/post-slug
    $categories = get_the_category($post->ID);
    $category_slug = 'uncategorized';

    if (!empty($categories)) {
        $category_slug = $categories[0]->slug;
    }

    return NEXTJS_FRONTEND_URL . "/" . $prefix . $category_slug . "/" . $post->post_name;
}

add_filter('page_row_actions', 'headless_change_admin_view_link', 10, 2);
add_filter('post_row_actions', 'headless_change_admin_view_link', 10, 2);

function headless_change_admin_view_link($actions, $post) {

    $frontend_url = headless_get_frontend_url_generic($post);

    if (isset($actions['view'])) {
        $actions['view'] = '<a href="' . $frontend_url . '" target="_blank">View</a>';
    }

    return $actions;
}

function headless_replace_permalink_generic($permalink, $post) {

    if (is_admin() && isset($_GET['preview'])) {
        return $permalink;
    }

    return headless_get_frontend_url_generic($post);
}

// add_filter('post_type_link', 'headless_replace_permalink_generic', 10, 2);
// add_filter('post_link', 'headless_replace_permalink_generic', 10, 2);
// add_filter('page_link', 'headless_replace_permalink_generic', 10, 2);



/*================================================================
Preview
================================================================*/
/**
 * WordPress Preview Custom REST Endpoint
 * 
 * This creates a custom endpoint to fetch draft posts for preview
 * using the validated token system.
 * 
 * ADD THIS to your functions.php (in addition to the preview link code)
 */

/**
 * Register custom REST endpoint for fetching preview posts
 */
add_filter('preview_post_link', function($preview_link, $post) {

    $nextjs_preview_url = NEXTJS_FRONTEND_URL . '/api/preview';

    $post_id = $post->ID;

    // Get language
    $lang_data = apply_filters('wpml_post_language_details', null, $post_id);
    $lang = $lang_data['language_code'] ?? 'en';

    // Category slug for route
    $categories = get_the_category($post_id);
    $category_slug = 'uncategorized';

    if (!empty($categories)) {
        $category_slug = $categories[0]->slug;
    }

    // Token create
    $response = nj_create_preview_token_with_id($post_id);
    if (is_wp_error($response)) {
        return $preview_link;
    }

    $token = $response->get_data()['token'];

    // Final optimized preview URL (NO slug needed)
    $preview_url = add_query_arg([
        'token' => $token,
        'lang' => $lang,
        'id' => $post_id,
        'category' => $category_slug
    ], $nextjs_preview_url);

    return $preview_url;

}, 10, 2);



function nj_create_preview_token_with_id($post_id) {
    if (!current_user_can('edit_post', $post_id)) {
        return new WP_Error('forbidden', 'No permission', ['status' => 403]);
    }

    $token = bin2hex(random_bytes(24));
    $expires = time() + 60 * 10;

    $data = [
        'post_id' => $post_id,
        'user_id' => get_current_user_id(),
        'expires' => $expires,
    ];

    set_transient('nj_preview_' . $token, $data, 60 * 10);

    return rest_ensure_response(['token' => $token]);
}

add_action('rest_api_init', function() {

    register_rest_route('nextjs/v1', '/validate-preview', [
        'methods' => 'GET',
        'callback' => 'nj_validate_preview_token',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('nextjs/v1', '/preview-post', [
        'methods' => 'GET',
        'callback' => 'nj_get_preview_post',
        'permission_callback' => '__return_true',
    ]);
});


function nj_validate_preview_token(\WP_REST_Request $req) {
    $token = $req->get_param('token');

    if (!$token) {
        return new WP_Error('bad_request', 'Token required', ['status'=>400]);
    }

    $data = get_transient('nj_preview_' . $token);

    if (!$data) {
        return new WP_Error('invalid_token', 'Token invalid or expired', ['status'=>401]);
    }

    return rest_ensure_response([
        'valid' => true,
        'post_id' => $data['post_id'],
        'expires' => $data['expires']
    ]);
}

function nj_get_preview_post(\WP_REST_Request $req) {

    $token = $req->get_param('token');
    $slug  = sanitize_title($req->get_param('slug'));

    if (!$token) {
        return new WP_Error('bad_request', 'Token required', ['status' => 400]);
    }

    $token_data = get_transient('nj_preview_' . $token);

    if (!$token_data) {
        return new WP_Error('invalid_token', 'Token invalid or expired', ['status'=>401]);
    }

    $post = get_post($token_data['post_id']);
    if (!$post) {
        return new WP_Error('not_found', 'Post not found', ['status'=>404]);
    }

    // WPML language
    $lang_data = apply_filters('wpml_post_language_details', null, $post->ID);
    $lang = $lang_data['language_code'] ?? 'en';

    $post_data = [
        'id' => $post->ID,
        'slug' => $post->post_name,
        'lang' => $lang,
        'title' => $post->post_title,
        'content' => apply_filters('the_content', $post->post_content),
        'excerpt' => get_the_excerpt($post),
        'status' => $post->post_status,
        'date' => $post->post_date,
        'modified' => $post->post_modified
    ];

    // Featured image
    if (has_post_thumbnail($post->ID)) {
        $post_data['featured_image'] = get_the_post_thumbnail_url($post->ID, 'full');
    } else {
        $post_data['featured_image'] = null;
    }

    // Categories
    $categories = get_the_category($post->ID);
    $post_data['categories'] = array_map(function($cat) {
        return [
            'id'   => $cat->term_id,
            'name' => $cat->name,
            'slug' => $cat->slug
        ];
    }, $categories ?: []);

    return rest_ensure_response($post_data);
}

