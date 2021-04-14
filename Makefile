init:
	sh .githook

push:
	sh .gitpush

manager:
	npm run lint:manager
	npm run build:manager

demo:
	npm run lint:demo
	npm run build:demo
	mkdir -p src/assets/plugins/
	cp -r dist/ng-plugin-demo/bundles/ng-plugin-demo.umd.min.js src/assets/plugins/

app:
	npm run lint
	npm run dev

dev: manager demo app

build: manager demo
	npm run build

# todo: 串行执行 app 与 lib 的 version patch 指令
# todo: 检查 app version 与 lib version 是否相同
# todo: 解决 tag 问题
patch:
	(npm version patch --no-git-tag-version)
	(cd projects/ng-plugin-manager && npm version patch --no-git-tag-version)
	git add .
	git commit

# todo: 检查 app version 与 lib version 是否相同
publish: manager
	cd dist/ng-plugin-manager && npm publish

