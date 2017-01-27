git config user.email "cedric.burceaux"
git config user.name "nrgy"
echo "########## Déploiement en béta ##########" 
set -e
GITURL=https://github.com/gooodhub/goood-site-dev.git
if [ -d "./dist" ]
then
rm -rf dist
fi
git clone -b gh-pages --single-branch $GITURL dist
cd dist
git checkout gh-pages
# ls -a | grep -v '^\.$' | grep -v '^\.\.$' | grep -v '^\.git$' | xargs rm -rf
mv .git ../gitdeploy
cd ..
npm install
NODE_ENV=production node index.js
cd dist
mv CNAME.BETA CNAME
rm CNAME.PROD
mv ../gitdeploy .git
git add .
git commit -am "auto-commit"
git push --force 
cd ..