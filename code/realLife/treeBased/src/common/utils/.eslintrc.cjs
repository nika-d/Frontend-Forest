module.exports = {
    rules: {
        'no-restricted-imports': [
            'error',
            {
                patterns: [
                    {
                        group: ['!lodash'],
                    },
                ],
            },
        ],
    },
}
