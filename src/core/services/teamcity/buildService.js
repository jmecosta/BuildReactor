define([
	'core/services/buildServiceBase',
	'core/services/request',
	'core/services/teamcity/teamcityBuild',
	'mout/object/mixIn',
	'common/joinUrl'
], function (BuildServiceBase, request, TravisBuild, mixIn, joinUrl) {

	'use strict';

	var TeamcityBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings, TeamcityBuildService.settings()));
		this.Build = TravisBuild;
		this.availableBuilds = availableBuilds;
	};

	TeamcityBuildService.settings = function () {
		return {
			typeName: 'TeamCity',
			baseUrl: 'teamcity',
			urlHint: 'URL, e.g. http://teamcity.jetbrains.com/',
			icon: 'src/core/services/teamcity/icon.png',
			logo: 'src/core/services/teamcity/logo.png',
			defaultConfig: {
				baseUrl: 'teamcity',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				branch: '',
				updateInterval: 60
			}
		};
	};

	var availableBuilds = function () {
		var urlPath = ((this.settings.username) ? 'httpAuth' : 'guestAuth');
		urlPath += '/app/rest/buildTypes';
		if (this.settings.branch) {
			urlPath += '?branch:(' + this.settings.branch + ')';
		}
		return request.json({
			url: joinUrl(this.settings.url, urlPath),
			username: this.settings.username,
			password: this.settings.password,
			parser: function (buildTypesJson) {
				return {
					items: !buildTypesJson.buildType ? [] :
						buildTypesJson.buildType.map(function (d, i) {
							return {
								id: d.id,
								name: d.name,
								group: d.projectName,
								isDisabled: false
							};
						})
				};
			}

		});
	};

	return TeamcityBuildService;
});