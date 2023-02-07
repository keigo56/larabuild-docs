const {description} = require('../../package')

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'Larabuild Documentation',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description: description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head: [
        ['meta', {name: 'theme-color', content: '#f9322c'}],
        ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
        ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}]
    ],

    // theme: 'default-prefers-color-scheme',
    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        repo: '',
        editLinks: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        nav: [
            {
                text: 'Get Started',
                items: [
                    {
                        text: 'Setup project', items: [
                            {
                                text: 'Setup Laravel Project',
                                link: '/laravel/'
                            },
                            {
                                text: 'Setup Vue Project',
                                link: '/vue/'
                            }
                        ]
                    },
                    {
                        text: 'Best Practices',
                        items: [
                            {
                                text: 'Optimize Queries',
                                link: '/best-practices/'
                            }
                        ]
                    }
                ]
            }
            // {
            //   text: 'Config',
            //   link: '/config/'
            // },
            // {
            //   text: 'VuePress',
            //   link: 'https://v1.vuepress.vuejs.org'
            // }
        ],
        sidebar: {
            '/laravel/': [
                {
                    title: 'Setup A Laravel Project',
                    collapsable: false,
                    children: [
                        '',
                        'open-project-vs-code',
                        'running-project',
                        'setup-github-repository',
                    ]
                }
            ],
        }
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        // '@vuepress/plugin-back-to-top',
        // '@vuepress/plugin-medium-zoom',
        // ['vuepress-plugin-code-copy', {
        //   align: 'top',
        //   color: '#ccc'
        // }]
    ]
}