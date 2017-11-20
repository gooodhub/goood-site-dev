# Goood website

## À propos

Code source du site web Goood.

* Metalsmith
* Markdown
* Browser-sync
* Sass
* Autoprefixer
* Permalinks
* Webpack

Le site est en build et deploiement continu sur beta.goood.pro
Chaine d'intégration visible sur https://travis-ci.org/gooodhub/goood-site-dev

Alternativement on peut installer Git et travailler en local. Il faut un environnement Linux ou Mac.

# Travail en local 

## Installation

```bash
npm install
```

## Lancer le serveur de dev

```bash
npm run dev
```

## Deployer

```bash
npm run deploy-beta
```
Compile les fichiers et déploie sur le repo [goood-site-dev](https://github.com/gooodhub/goood-site-dev)

Visible sur: http://beta.goood.pro


```bash
npm run deploy-prod
```
Compile les fichiers et déploie sur le repo [goood-site-prod](https://github.com/gooodhub/goood-site-prod)

Visible sur: https://www.goood.pro/

## Plugins utilisés

* [ScrollMagic](https://github.com/janpaepke/ScrollMagic)
* [Flickity](https://github.com/metafizzy/flickity)
* [ObjectFitImages](https://github.com/bfred-it/object-fit-images)
* [MobileDetect](https://github.com/hgoebl/mobile-detect.js)
* [Page](https://visionmedia.github.io/page.js/)
* [HammerJS](https://github.com/hammerjs/hammer.js)
* [BLazy](https://github.com/dinbror/blazy)
