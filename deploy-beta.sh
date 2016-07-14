echo "Entrez le descriptif des changements et tapez [ENTER]: "
read commitmsg
set -e
GITURL=https://github.com/gooodhub/goood-site-dev.git
if [ -d "./dist" ]
then
cd dist
rm -rf .git/
else
mkdir dist
cd dist
fi
git init
git remote add origin $GITURL
git pull origin gh-pages
echo "rm "
ls -a | grep -v '.*' | xargs rm -rf
cd ..
echo "npm install"
npm install
NODE_ENV=production node index.js
echo "git add"
git add .
git commit -am "$commitmsg"
echo "git push"
git push origin master:gh-pages --force
cd ..