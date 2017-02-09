
echo "########## Déploiement en béta ##########" 
echo "Entrez le descriptif des changements et tapez [ENTRÉE]: " 
commitmsg="auto-commit"
if [ $TRAVIS_COMMIT_MESSAGE != "" ]
then
	$commitmsg = $TRAVIS_COMMIT_MESSAGE
fi

echo "#### Configuration du tag ###"
taggen=$uuidgen
echo "### tag généré : $tag ###"
git tag -a $taggen -m "version $taggen"
echo "$taggen" >> static/version.txt

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

echo "########## Configuration du repo ##########" 
TARGET_BRANCH="gh-pages"
SSH_REPO='git@github.com:gooodhub/goood-site-dev.git'

echo "########## Configuration du compte git pour commit ##########" 
git config user.email "cedric.burceaux@gmail.com"
git config user.name "nrgy"

echo "########## Ajout des données à commit ##########"
git add .
git commit -am "$commitmsg"

echo "########## Chiffrement des données ##########"
openssl aes-256-cbc -K $encrypted_65e126d10998_key -iv $encrypted_65e126d10998_iv -in deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval "$(ssh-agent)"
ssh-add deploy_key

echo "########## Push des modifications ##########" 
# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH --force
