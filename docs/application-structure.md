# Application structure

> This document is a DRAFT. All described aspects are subject to change in any time and without notification.

## Folder structure

Model and controller definitions loaded by `support.loadModules`

```
// /api/models/path/resource.js
// This file will use generic controller
```

```
// /api/controllers/path/resource.js
module.exports = {
	action: function () {}
}
```

Configuration of controller actions:

```
// /config/routes.js
module.exports = {
	pathResource: ['/other/path/resource', {
		action: {
			mountPath: '/',
			methods: ['GET']
		}
	}]
}
```

Configuration of policies:

```
// /config/policies.js
module.exports = {
	'*': ['isTrusted'],
	pathResource: {
		'*': ['isAuth'],
		action: ['isAuth', 'isAdmin']
	}
}
```