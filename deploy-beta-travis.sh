
echo "########## Déploiement en béta ##########" 
echo "Entrez le descriptif des changements et tapez [ENTRÉE]: " 
commitmsg="auto-commit"
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
SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
SSH_REPO='git@github.com:gooodhub/goood-site-dev.git'

echo "########## Configuration du compte git pour commit ##########" 
git config user.email "cedric.burceaux@gmail.com"
git config user.name "nrgy"

echo "########## Ajout des données à commit ##########"
git add .
git commit -am "$commitmsg"

echo "########## Chiffrement des données ##########"
openssl aes-256-cbc -K $encrypted_ae9254447b5f_key -iv $encrypted_ae9254447b5f_iv -in cle.enc -out cle -d
chmod 600 cle.enc
eval 'ssh-agent -s'
ssh-add cle

echo "########## Push des modifications ##########" 
# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH --force
