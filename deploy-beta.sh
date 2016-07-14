echo "Entrez le descriptif des changements et tapez [ENTER]: "
read commitmsg
set -e
GITURL=https://github.com/gooodhub/goood-site-dev.git
if [ -d "./dist" ]
then
rm -rf dist
fi
git clone $GITURL dist
cd dist
echo "Récup dist.Appuyez sur entree"
read dummy
echo "rm "
ls -a | grep -v '^\.$' | grep -v '^\.\.$' | grep -v '^\.git$' | xargs rm -rf
read dummy2
cd ..
echo "npm install"
npm install
NODE_ENV=production node index.js
cd dist
echo "git add"
read dummy3
git add .
git commit -am "$commitmsg"
echo "git push"
# git push --force 
git push origin gh-pages --force
cd ..