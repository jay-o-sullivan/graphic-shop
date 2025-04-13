@echo off
echo Fixing Git history to remove sensitive data...

REM Create a backup branch first
git branch backup-branch

REM Configure Git
git config --global filter.stripe-key.clean "sed 's/sk_test_[a-zA-Z0-9]*//g'"
git config --global filter.stripe-key.smudge cat

REM Create .gitattributes file if it doesn't exist
echo .env filter=stripe-key > .gitattributes

REM Use BFG Repo Cleaner or git-filter-branch to remove the sensitive data
REM Option 1: git filter-branch
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

REM Option 2: Use BFG (comment out the above and uncomment this if you have BFG installed)
REM java -jar bfg.jar --replace-text passwords.txt .

REM Force push to remote
echo.
echo IMPORTANT: After reviewing the changes, you can force push with:
echo git push --force
echo.

echo Done! Make sure to check the results before force pushing.
echo Also, ensure all contributors clone a fresh copy after this operation.
pause
