clean:
	rm -rf dist/*
dist:
	cp -R js dist
	cp -R css dist
	cp -R img dist
	cp index.html dist
	cp about.html dist
	cp favicon.ico dist
	cp -R font dist

deploy:
	date
	ssh chichai@ravenwest.dreamhost.com "rm -rf /home/chichai/reddasaur.us/*"
	scp -r dist/* chichai@ravenwest.dreamhost.com:reddasaur.us/

default: clean dist deploy
