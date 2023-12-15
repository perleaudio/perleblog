class GoogleAnalyticsIntegrationPlugin {
	constructor (API, name, config) {
		this.API = API;
		this.name = name;
		this.config = config;
	}

	addInsertions () {
		this.API.addInsertion('publiiHead', this.addHeadCode, 1, this);
		this.API.addInsertion('customBodyCode', this.addBodyCode, 1, this);
	}

	addHeadCode (rendererInstance) {
		let scriptToLoad = '';
		let cookieBannerGroup = 'text/javascript';

		if (this.config.cookieBannerIntegration) {
			cookieBannerGroup = 'gdpr-blocker/' + this.config.cookieBannerGroup.trim();
		}

		if (!rendererInstance.previewMode || this.config.previewMode) {
			if (this.config.codeVariant === 'gtag') {
				let ipAnonymizeOption = '';

				if (this.config.anonymizeIP) {
					ipAnonymizeOption = ", { 'anonymize_ip': true }";
				}

				scriptToLoad = `
				<!-- Global site tag (gtag.js) - Google Analytics -->
				<script 
					type="${cookieBannerGroup}"
					async 
					src="https://www.googletagmanager.com/gtag/js?id=${this.config.trackingID}"></script>
				<script type="${cookieBannerGroup}">
				  window.dataLayer = window.dataLayer || [];
				  function gtag(){dataLayer.push(arguments);}
				  gtag('js', new Date());
				  gtag('config', '${this.config.trackingID}' ${ipAnonymizeOption});
				  ${this.config.customCode}
				</script>				
				`;
			} else if (this.config.codeVariant === 'gtm') {
				scriptToLoad = `
				<!-- Google Tag Manager -->
				<script type="${cookieBannerGroup}">
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','${this.config.trackingID}');
				</script>
				<!-- End Google Tag Manager -->
				`;	
			}
		}

		return scriptToLoad;
	}

	addBodyCode (rendererInstance) {
		if (
			(!rendererInstance.previewMode || this.config.previewMode) && 
			!this.config.cookieBannerIntegration && this.config.codeVariant === 'gtm'
		) {
			return `
			<!-- Google Tag Manager (noscript) -->
			<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.trackingID}"
			height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
			<!-- End Google Tag Manager (noscript) -->
			`;
		}
	}
}

module.exports = GoogleAnalyticsIntegrationPlugin;