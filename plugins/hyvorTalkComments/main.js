class HyvorTalkCommentsPlugin {
	constructor (API, name, config) {
		this.API = API;
		this.name = name;
		this.config = config;
	}

	addInsertions () {
		this.API.addInsertion('customCommentsCode', this.addPostScripts, 1, this);
	}

	addPostScripts (rendererInstance, context) {
		let url = '';
		let uniquePageID = '';
		let previewNotice = '';
		let scriptToLoad = '';
		let cookieBannerGroup = 'text/javascript';
		let consentScriptToLoad = '';
		let consentNotice = '';
		let lazyload = 'scroll';
		let cssHeaderClass = ` class="${this.config.cssHeaderClass}"`;
		let cssWrapperClass = ` class="${this.config.cssWrapperClass}"`;
		let cssInnerWrapperClass = ` class="${this.config.cssInnerWrapperClass}"`;

		if (!this.config.cssHeaderClass) {
			cssHeaderClass = '';
		}

		if (!this.config.cssWrapperClass) {
			cssWrapperClass = '';
		}

		if (!this.config.cssInnerWrapperClass) {
			cssInnerWrapperClass = '';
		}

		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			url = rendererInstance.globalContext.website.pageUrl;
		}

		if (context && context.post && context.post.id) {
			uniquePageID = context.post.id;
		} else {
			uniquePageID = url;
		}

		if (!this.config.lazyload) {
			lazyload = 'click';
		} 

		let heading = `
			<h${this.config.headingLevel}${cssHeaderClass}>
		        ${this.config.textHeader}
		    </h${this.config.headingLevel}>
	    `;

	    if (!this.config.textHeader) {
	    	heading = '';
	    }

	    if (this.config.cookieBannerIntegration) {
			cookieBannerGroup = 'gdpr-blocker/' + this.config.cookieBannerGroup.trim();
			consentScriptToLoad = `
			<script type="text/javascript">
				document.body.addEventListener('publii-cookie-banner-unblock-${this.config.cookieBannerGroup.trim()}', function () {
					document.getElementById('hyvortalk-no-consent-info').style.display = 'none';
				}, false);
			</script>`;
			consentNotice = `<div
				data-gdpr-group="${cookieBannerGroup}"
				id="hyvortalk-no-consent-info" 
				style="background: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; color: #666; display: block; margin-top: 10px; padding: 10px; text-align: center; width: 100%;">
				${this.config.cookieBannerNoConsentText}
			</div>`;
		}

	    if (rendererInstance.previewMode) {
	    	previewNotice = `<div style="background: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; color: #666; display: block; padding: 10px; text-align: center; width: 100%;">Hyvor Talk comments are not working in the preview mode and may display error messages below.</div>`;
	    }

		if (!rendererInstance.previewMode) {
			scriptToLoad = `
				<script type="text/javascript">
					var HYVOR_TALK_WEBSITE = '${this.config.websiteId}';
					var HYVOR_TALK_CONFIG = {
						url: '${url}',
						id: '${uniquePageID}',
						loadMode: '${lazyload}'
					};
				</script>
				<script async type="${cookieBannerGroup}" src="https://talk.hyvor.com/web-api/embed.js"></script>
			`;
		}

		return `
			<div${cssWrapperClass}>
	            <div${cssInnerWrapperClass}>
	               	${heading}
	               	${previewNotice}					
					<div id="hyvor-talk-view"></div>
					<noscript>${this.config.textFallback}</noscript>
					${consentNotice}
				</div>
			</div>
			${scriptToLoad}
			${consentScriptToLoad}
    	`;
	}
}

module.exports = HyvorTalkCommentsPlugin;