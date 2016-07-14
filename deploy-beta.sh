echo -n "Entrez le descriptif des changements et tapez [ENTER]: "
read commitmsg
set -e
GITURL=https://github.com/gooodhub/goood-site-dev.git
npm install
NODE_ENV=production node index.js
cd dist
rm -rf .git/
git init
git remote add origin $GITURL
git add .
git commit -am $commitmsg
git push origin master:gh-pages --force
