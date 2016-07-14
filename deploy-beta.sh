echo "Entrez le descriptif des changements et tapez [ENTER]: "
read commitmsg
set -e
GITURL=https://github.com/gooodhub/goood-site-dev.git
echo "npm install"
npm install
NODE_ENV=production node index.js
cd dist
rm -rf .git/
git init
git remote add origin $GITURL
echo "git pull"
git pull origin master:gh-pages
echo "rm "
ls -a | grep -v '.*' | xargs rm -rf
echo "git add"
git add .
git commit -am "$commitmsg"
echo "git push"
git push origin master:gh-pages --force
cd ..