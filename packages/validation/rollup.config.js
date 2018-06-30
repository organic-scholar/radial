
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'lib/index.js',
        external: ['@radial/helpers'],
        output: {
            name: 'RadialValidation',
            file: 'dist/radial-validation.js',
            format: 'umd'
        },
        plugins: [
            resolve(), // so Rollup can find `ms`
            commonjs() // so Rollup can convert `ms` to an ES module
        ]
    },
];