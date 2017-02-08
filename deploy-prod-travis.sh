
echo "########## Déploiement en production ##########"
echo "##########  Vérification des numéros de version ######"
versionBeta=$(npm version | grep 'goood:' | sed 's/^.*: //' | tr -d ',' | grep -oP "(?<=').*?(?=')");
versionProd=$(cat version-production.txt);
echo "### version beta est : $versionBeta ####"
echo $versionBeta;
echo "### version prod est : $versionProd ####"
echo $versionProd;
if [ $versionBeta != $versionProd]
then
	echo "#### La version de production ne correspond pas à la version actuellement en béta #####"
	exit -1
fi
echo "Entrez le descriptif des changements et tapez [ENTRÉE]: " 
commitmsg="auto-commit"
if [ $TRAVIS_COMMIT_MESSAGE != "" ]
then
	$commitmsg = $TRAVIS_COMMIT_MESSAGE
fi
GITURL=https://github.com/gooodhub/goood-site-prod.git
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

echo "########## Configuration du repo ##########" 
TARGET_BRANCH="gh-pages"
SSH_REPO='git@github.com:gooodhub/goood-site-prod.git'

echo "########## Configuration du compte git pour commit ##########" 
git config user.email "cedric.burceaux@gmail.com"
git config user.name "nrgy"

echo "########## Ajout des données à commit ##########"
git add .
git commit -am "$commitmsg"

echo "########## Chiffrement des données ##########"
openssl aes-256-cbc -K $encrypted_01cfe8fba927_key -iv $encrypted_01cfe8fba927_iv -in deploy_key_prod.enc -out deploy_key_prod -d
chmod 600 deploy_key_prod
eval "$(ssh-agent)"
ssh-add deploy_key_prod

echo "########## Push des modifications ##########" 
# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH --force
