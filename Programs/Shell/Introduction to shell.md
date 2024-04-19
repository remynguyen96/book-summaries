##### `pwd`
Short for "**p**rint **w**orking **d**irectory". This prints the absolute path of your **current working directory**, which is where the shell runs commands and looks for files by default. The shell decides if a path is absolute or relative by looking at its first character: If it begins with `/`, it is absolute. If it _does not_ begin with `/`, it is relative.
##### `ls`
Short for "**l**i**s**ting". Lists the contents of your current directory. If you add the names of some files, `ls` will list them, and if you add the names of directories, it will list their contents.
In order to see everything underneath a directory, no matter how deeply nested it is, you can give `ls` the flag `-R` (which means "recursive")

`ls` has another flag `-F` that prints a `/` after the name of every directory and a `*` after the name of every runnable program. Run `ls` with the two flags, `-R` and `-F`, and the absolute path to your home directory to see everything it contains. (The order of the flags doesn't matter, but the directory name must come last.)

##### `cd`
Which stands for "change directory". More often, though, you will take advantage of the fact that the special path `..` (two dots with no spaces) means "the directory above the one I'm currently in". If you are in `/home/repl/seasonal`, then `cd ..` moves you up to `/home/repl`
(Remember to put a space between `cd` and `..` - it is a command and a path, not a single four-letter command). One final special path is `~` (the tilde character), which means "your home directory", such as `/home/repl`. No matter where you are, `ls ~` will always list the contents of your home directory, and `cd ~` will always take you home.
##### `sed`
Does pattern-matched string replacement

```sh
$ echo cat cabbage | sed 's/a/@/g'
#output: c@t c@bb@ge
```
##### `cp`
Which is short for "copy".  
`cp original.txt duplicate.txt`: Creates a copy of `original.txt` called `duplicate.txt`. If there already was a file called `duplicate.txt`, it is overwritten

If the last parameter to `cp` is an existing directory, then a command like:
```sh
cp seasonal/autumn.csv seasonal/winter.csv backup
```
Copies _all_ of the files into that directory.
##### `mv`
Moves it from one directory to another, just as if you had dragged it in a graphical file browser.
It handles its parameters the same way as `cp`, so the command:
```sh
mv autumn.csv winter.csv ..
```
`mv` can also be used to rename files. If you run:
```sh
mv course.txt old-course.txt
```
##### `rm`
To delete files, we use `rm`, which stands for "remove". As with `cp` and `mv`, you can give `rm` the names of as many files as you'd like, so:
```sh
rm thesis.txt backup/thesis-2017-08.txt
```
Removes both `thesis.txt` and `backup/thesis-2017-08.txt`
Unlike graphical file browsers, the shell doesn't have a trash can, so when you type the command above, your thesis is gone for good. If you try to `rm` a directory, the shell prints an error message telling you it can't do that, primarily to stop you from accidentally deleting an entire directory full of work. Instead, you can use a separate command called `rmdir`. For added safety, it only works when the directory is empty, so you must delete the files in a directory _before_ you delete the directory. (Experienced users can use the `-r` option to `rm` to get the same effect; we will discuss command options in the next chapter.)

You will often create intermediate files when analyzing data. Rather than storing them in your home directory, you can put them in `/tmp`, which is where people and programs often keep files they only need briefly. (Note that `/tmp` is immediately below the root directory `/`, _not_ below your home directory.)
##### `cat`
Before you rename or delete files, you may want to have a look at their contents. The simplest way to do this is with `cat`, which just prints the contents of files onto the screen. (Its name is short for "concatenate", meaning "to link things together", since it will print all the files whose names you give it, one after the other.)

```sh
cat agarwal.txt
```

You can use `cat` to print large files and then scroll through the output, but it is usually more convenient to **page** the output. The original command for doing this was called `more`, but it has been superseded by a more powerful command called `less`. When you `less` a file, one page is displayed at a time; you can press spacebar to page down or type `q` to quit.
If you give `less` the names of several files, you can type `:n` (colon and a lower-case 'n') to move to the next file, `:p` to go back to the previous one, or `:q` to quit.
```sh
less seasonal/spring.csv seasonal/summer.csv
```
##### `head`
 If the dataset has been exported from a database or spreadsheet, it will often be stored as **comma-separated values** (CSV). A quick way to figure out what it contains is to look at the first few rows. We can do this in the shell using a command called `head`. As its name suggests, it prints the first few lines of a file (where "a few" means 10), so the command:
 `head seasonal/summer.csv`
You won't always want to look at the first 10 lines of a file, so the shell lets you change `head`'s behavior by giving it a **command-line flag** (or just "flag" for short). If you run the command:
```sh
head -n 3 seasonal/summer.csv
```
`head` will only display the first three lines of the file. If you run `head -n 100`, it will display the first 100 (assuming there are that many), and so on.

##### How can I select columns from a file?

`head` and `tail` let you select rows from a text file. If you want to select columns, you can use the command `cut`. It has several options (use `man cut` to explore them), but the most common is something like:
```sh
cut -f 2-5,8 -d , values.csv
```
which means "select columns 2 through 5 and columns 8, using comma as the separator". `cut` uses `-f` (meaning "fields") to specify columns and `-d` (meaning "delimiter") to specify the separator. You need to specify the latter because some files may use spaces, tabs, or colons to separate columns.

```sh
cut -d , -f 1 seasonal/spring.csv
# or to select first column from the file spring.csv
cut -f1 -d, seasonal/spring.csv
```

##### What can't cut do?
`cut` is a simple-minded command. In particular, it doesn't understand quoted strings. If, for example, your file is:
```txt
Name,Age
"Johel,Ranjit",28
"Sharma,Rupinder",26
```
 then: `cut -f 2 -d , everyone.csv`
will produce:
```txt
Age
Ranjit"
Rupinder"
```
rather than everyone's age, because it will think the comma between last and first names is a column separator.
What is the output of `cut -d : -f 2-4` on the line:
```
first:second:third:
## Output: second:third:
```

##### `history`
`history` will print a list of commands you have run recently. Each one is preceded by a serial number to make it easy to re-run particular commands: just type `!55` to re-run the 55th command in your history (if you have that many). You can also re-run a command by typing an exclamation mark followed by the command's name, such as `!head` or `!cut`, which will re-run the most recent use of that command.
##### How can I select lines containing specific values?
`head` and `tail` select rows, `cut` selects columns, and `grep` selects lines according to what they contain. In its simplest form, `grep` takes a piece of text followed by one or more filenames and prints all of the lines in those files that contain that text. For example, `grep bicuspid seasonal/winter.csv` prints lines from `winter.csv` that contain "bicuspid".

`grep` can search for patterns as well; we will explore those in the next course. What's more important right now is some of `grep`'s more common flags:
- `-c`: print a count of matching lines rather than the lines themselves
- `-h`: do _not_ print the names of files when searching multiple files
- `-i`: ignore case (e.g., treat "Regression" and "regression" as matches)
- `-l`: print the names of files that contain matches, not the matches
- `-n`: print line numbers for matching lines
- `-v`: invert the match, i.e., only show lines that _don't_ match
Remember, it's considered good style to put all of the flags _before_ other values like filenames or the search term. E.g. `grep -n -v molar seasonal/spring.csv`

```sh
cat two_cities.txt | grep 'Sydney Carton\|Charles Darnay' | wc -l
cat two_cities.txt | grep -E 'Sydney Carton|Charles Darnay' | wc -l
# or escape metacharacters with egrep
cat two_cities.txt | egrep 'Sydney Carton|Charles Darnay' | wc -l
```

##### How can I store a command's output in a file?
If you run this command instead. So nothing appears on the screen
```sh
head -n 5 seasonal/summer.csv > top.csv
```
Instead, `head`'s output is put in a new file called `top.csv`. The greater-than sign `>` tells the shell to redirect `head`'s output to a file
##### How can I use a command's output as an input?
Suppose you want to get lines from the middle of a file. More specifically, suppose you want to get lines 3-5 from one of our data files. You can start by using `head` to get the first 5 lines and redirect that to a file, and then use `tail` to select the last 3:
```sh
head -n 5 seasonal/winter.csv > top.csv
tail -n 3 top.csv

# The shell provides another tool that solves both of these problems at once called a pipe

head -n 5 seasonal/winter.csv | tail -n 3


# For example
cut -d , -f 1 seasonal/spring.csv | grep -v Date | head -n 10

# 1. select the first column from the spring data;
# 2. remove the header line containing the word "Date"; and
# 3. select the first 10 lines of actual data.
```

The command `wc` (short for "word count") prints the number of **c**haracters, **w**ords, and **l**ines in a file. You can make it print only one of these using `-c`, `-w`, or `-l` respectively.

Use `wc -l $@` to count lines in all the files given on the command line.
##### What other wildcards can I use?
 The shell has other wildcards as well, though they are less commonly used:

- `?` matches a single character, so `201?.txt` will match `2017.txt` or `2018.txt`, but not `2017-01.txt`.
- `[...]` matches any one of the characters inside the square brackets, so `201[78].txt` matches `2017.txt` or `2018.txt`, but not `2016.txt`.
- `{...}` matches any of the comma-separated patterns inside the curly brackets, so `{*.txt, *.csv}` matches any file whose name ends with `.txt` or `.csv`, but not files whose names end with `.pdf`.
##### How can I sort lines of text?
As its name suggests, `sort` puts data in order. By default it does this in ascending alphabetical order, but the flags `-n` and `-r` can be used to sort numerically and reverse the order of its output, while `-b` tells it to ignore leading blanks and `-f` tells it to **f**old case (i.e., be case-insensitive). Pipelines often use `grep` to get rid of unwanted records and then `sort` to put the remaining records in order.
##### How can I remove duplicate lines?
Another command that is often used with `sort` is `uniq`, whose job is to remove duplicated lines. More specifically, it removes _adjacent_ duplicated lines. 
In order to remove non-adjacent lines from a file, it would have to keep the whole file in memory (or at least, all the unique lines seen so far). By only removing adjacent duplicates, it only has to keep the most recent unique line in memory.
##### How can I print a variable's value?
To get the variable's value, you must put a dollar sign `$` in front of it.
```sh
echo $USER

#To create a shell variable, you simply assign a value to a name:
training=sessonal/summer.csv
#  _without_ any spaces before or after the `=` sign. Once you have done this, you can check the variable's value with:

echo $training
head -n 1 $testing
```
##### How can I repeat a command many times?
Shell variables are also used in **loops**, which repeat commands many times. If we run this command:
```sh
for filetype in gif jpg png; do echo $filetype; done
```
it produces: 
```sh
gif
jpg
png
```

Notice these things about the loop:
1. The structure is `for` …variable… `in` …list… `; do` …body… `; done`
2. The list of things the loop is to process (in our case, the words `gif`, `jpg`, and `png`).
3. The variable that keeps track of which thing the loop is currently processing (in our case, `filetype`).
4. The body of the loop that does the processing (in our case, `echo $filetype`).
Notice that the body uses `$filetype` to get the variable's value instead of just `filetype`, just like it does with any other shell variable. Also notice where the semi-colons go: the first one comes between the list and the keyword `do`, and the second comes between the body and the keyword `done`.
##### How can I run many commands in a single loop?
Printing filenames is useful for debugging, but the real purpose of loops is to do things with multiple files. This loop prints the second line of each data file:

```sh
for file in seasonal/*.csv; do grep 2017-07 $file | head -n 2 | tail -n 1; done
```
##### How can I pass filenames to scripts?
A script that processes specific files is useful as a record of what you did, but one that allows you to process any files you want is more useful. To support this, you can use the special expression `$@` (dollar sign immediately followed by at-sign) to mean "all of the command-line parameters given to the script".

For example, if `unique-lines.sh` contains `sort $@ | uniq`, when you run:
```sh
bash unique-lines.sh seasonal/summer.csv
```
the shell replaces `$@` with `seasonal/summer.csv` and processes one file. If you run this:
```sh
bash unique-lines.sh seasonal/summer.csv seasonal/autumn.csv
```
it processes two data files, and so on.

As well as `$@`, the shell lets you use `$1`, `$2`, and so on to refer to specific command-line parameters. You can use this to write commands that feel simpler or more natural than the shell's.
##### How can I write loops in a shell script?
Shell scripts can also contain loops. You can write them using semi-colons, or split them across lines without semi-colons to make them more readable:
```sh
# Print the first and last data records of each file.
for filename in $@
do
    head -n 2 $filename | tail -n 1
    tail -n 1 $filename
done
```
(You don't have to indent the commands inside the loop, but doing so makes things clearer.)
###### What happens when I don't provide filenames?
A common mistake in shell scripts (and interactive commands) is to put filenames in the wrong place. If you type: `tail -n 3` then since `tail` hasn't been given any filenames, it waits to read input from your keyboard. Use `Ctrl` + `C` to stop the running `tail` program.
##### `sed`
Does pattern-matched string replacement
`sed -r`: In some engines, you need to escape metacharacters such as `+` and `?`. In others, you don't.
```sh
$ echo hello beep boop | sed 's/b..p/XXXX/g'
#Output: hello XXXX XXXX

echo 'beep and boop' | sed 's/[a-f]/X/g'
#Output: XXXp XnX Xoop

echo 'beep boop' | sed 's/[^aeiou]/Z/g' # negated character class [^...]
#Output: ZeeZZZooZ
```

Flags: `s/PATTERN/REP/FLAGS` or `/PATTERN/FLAGS`
- i - case insensitive
- g - match all occurences (global)
- m - treat string as multiple lines
- s - treat string as a single line

Metacharacters:
- `.` matches any character
- `[]` - character class
- `^` - anchor at the beginning
- `$` - anchor to the end
- `(a|b)` - match a or b
- `()` - capture group
- `(?:)` non capture group
- `\d` - digit `[0-9]`
- `\w` - word `[A-Za-z0-9_]`
- `\s` - whitespace `[ \t\r\n\f]`
Quantifier:
- `?` - zero or one time
- `*` - zero or more times
- `+` - one or more times

```sh
$ echo 'dog and doge' | sed 's/doge\?/DOGE/g'
DOGE and DOGE
$ echo 'beep bp beeeeep' | sed 's/be*p/BEEP/g'
BEEP BEEP BEEP
$ echo 'beep bp beeeeep' | sed 's/be\+p/BEEP/g'
BEEP bp BEEP
```

Character class sequences:
- `\w` - word character: `[A-Za-z0-9_]`
- `\W` - non-word character: `[^A-Za-z0-9_]`
- `\s` - whitespace: `[ \t\r\n\f]`
- `\S` - non-whitespace: `[^ \t\r\n\f]`
- `\d` - digit: `[0-9]`
- `\D` - non-digit: `[^0-9]`

Group:
- `()` capture group
- `(?:)` non capture group

```sh
$ echo 'hey <cool> whatever' | sed -r 's/<([^>]+)>/(\1)/g'
# output: hey (cool) whatever

# back references in sed
$ echo 'hey cool cool beans' | sed -r 's/(\S+) \1/REPEATED/'
# output: hey REPEATED beans

``` 
#### References:
https://github.com/FrontendMasters/fmmn/blob/master/day1/regex.md