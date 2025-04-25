/** @type {import('next').NextConfig} */
const nextConfig = {
	// إزالة أو تعليق التصدير الثابت
	// output: 'export',

	eslint: {
		// السماح باستكمال البناء حتى مع أخطاء ESLint
		ignoreDuringBuilds: true,
	},
};

module.exports = nextConfig;
