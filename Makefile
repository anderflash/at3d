doc:
	./criardoc

all:
	./criardoc && ./minificar && ./deploylocal

min:
	./minificar
	
deploy:
	./deploylocal

clean:
	rm -Rf doc/*
	rm -Rf dist/*