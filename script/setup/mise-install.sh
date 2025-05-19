#!/bin/bash

curl https://mise.run | sh
~/.local/bin/mise --version
# output 👉 mise 2024.x.x

# bash install
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc

# local install (for the current .mise.toml)
# mise use node@22

# If the `.mise.toml` file is in the root of the project, the environment will be installed.
mise i

echo "mise setup done! 🐈‍⬛"