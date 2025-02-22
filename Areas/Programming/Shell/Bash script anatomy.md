It usually begins with `#!/usr/bash` or `#!/bin/bash` (on its own line). So your interpreter known it is a Bash script and to use Bash located in `/usr/bash` or `/bin/bash` (type `which bash` to check current Bash path)
File extension `.sh` - Technically not needed if first line has the she-bang and path to Bash, but a convention.
Can be run in the terminal using `bash script.sh`. Or if you have mentioned she-bang at first line then simply run using `./script.sh`

There are three **streams** for your program:
1. **`STDIN`** (standard input). A stream of data into program
2. **`STDOUT`** (standard output). A stream of data out of the program
3. **`STDERR`** (standard error) Errors in your program
By default, these streams will come from and write out to the terminal.
Though you may see `2> /dev/null` in script calls; redirecting STDERR to be deleted. (`1> /dev/null`) would be STDOUT

##### ARGV 
A key concept in Bash scripting is **arguments**. Bash scripts can take arguments to be used inside by adding a space after the script execution call.
- ARGV is the array of all the arguments given to the program
- Each argument can be accessed via the `$` notation. The first as `$1`, the second as `$2` etc.
- `$@` and `$*` give all arguments in ARGV
- `$#` gives the length (number) of arguments.
```sh
#!/bin/bash
echo $1
echo $2
echo $@
echo "There are " $# "arguments"

# bash args.sh one two three four five
# OUTPUT: There are 5 arguments
```
##### Single, Double, Backticks
In Bash, using different quotation marks can mean different things. Both when creating variables and printing.
- Single quotes (`'sometext'`) = Shell interprets what is between literally
- Double quotes (`"sometext"`) = Shell interprets literally except using **`$`** and backticks
- Backticks (\`sometext\`) = Shell runs the command and captures STDOUT back into a variable 

```sh
variable_backticks="The data is `date`."
variable_parentheses="The data is $(date)."

echo $variable # The date is Friday 19 ...
```

##### Numeric variables in Bash
Numbers are not natively supported. So  `expr` is a useful utility program. But cannot natively handle decimal places:
`expr 1 + 4`
`bc` (basic calculator) is a useful command-line program. Using `bc` without opening the calculator is possible by piping:
`echo "5 + 7.5" | bc`
`bc` also has a `scale` argument how many decimal places.
`echo "scale=3; 10 / 3" | bc`
A variant on single bracket variable notation for numeric variables: 
`echo $((5 + 7))`
```sh
model1=87.65
model2=89.20

echo "The average score is $(echo "($model1 + $model2) / 2)" | bc)"
```

##### Creating an array in Bash
Creation of a numerical-indexed can be done in two ways in Bash:
1. Declare without adding elements
	`declare -a my_first_array`
2. Create and add elements at the same time
	`my_first_array=(1 2 3)`

- All array elements can be returned using `array[@]`. Though do note, Bash requires curly brackets around the array name when you want to access these properties.
- The length of an array is accessed using `#array[@]`
- Accessing array elements using square brackets (Bash uses zero-indexing for arrays like Python)
- Use the notation `array[@]:N:M` to slice out a subset of the array. Here N is the starting index and M is how many elements to return.
- Append to an array using `array+=(elements)`

```sh
my_array=(1 3 5 2)

echo ${my_array[@]} # 1 3 5 2
echo ${#my_array[@]} # 4
echo ${my_array[2]} # 5

my_array[2]=9

echo ${my_array[2]} # 9

echo ${my_array[@]:2:2} # 9 2

my_array+=(10)
```

##### Associative arrays
⚠️ Caution: Only available in Bash 4 onwards. Some modern macs have old Bash. Check with `bash --version` in terminal
In Js:
`my_dict = {'city_name': 'New York', 'population': 140000}`

- You can only create associative array using the declare syntax

```sh
declare -A city_details # Declare first
city_details=([city_name]="New York" [population]=140000) # Add element
echo ${city_details[city_name]} # Index using key to return a value

# Alternatively, create an associative array and assign in one line.
declare -A city_details=([city_name]="New York" [population]=140000)

# Access the keys of an associative array with an !

echo ${!city_details[@]} # Return all the keys
```

##### If Statements
A basic IF statement in Bash has the following stucture:
```sh
if [ CONDITION ]; then
	# SOME CODE
else
	# SOME OTHER CODE 
fi
```
Arithmetic IF statements can use the double-parentheses structure:
`if (($x > 5)); then` or `if [$x -gt 5 ]; then`
Arithmetic IF statements can also use square brackets and an arithmetic flag rather than `>, <, =, !=` etc.
- `-eq` for 'equal to'
- `-ne` for 'not equal to'
- `-lt` for 'less than'
- `-le` for 'less than or equal to'
- `-gt` for 'greater than'
- `-ge` for 'greater than or equal to'

Other Bash conditional flags for file-related such as:
- `-e` if the file exists
- `-s` if the file exists and has size greater than zero
- `-r` if the file exists and is readable
- `-w` if the file exists and is writable

To combine conditions (AND) or use an OR statement in Bash you use the following symbols:
- `&&` for AND
- `||` for OR

```sh
x=10
if [ $x -gt 5 ] && [ $x -lt 11 ]; then
# Or use double-square bracket notation:
if [[ $x -gt 5 && $x -lt 11 ]]; then

# You can call a shell-within-a-shell as well for your conditional.
if $(grep -q Hello words.txt); then
```

##### WHILE statement example
```sh
x=1
while [$x -le 3];
do
	echo $x
	((x+= 1))
done
```

##### FOR loop number ranges
Bash has a neat way to create a numeric range called 'brace expansion'. `{START..STOP..INCREMENT}`

```sh
for x in {1..5..2}
do
	echo $x # 1 3 5
done

# Another common way to write FOR loops is the three expression syntax
for ((x=2;x<=4;x+=2))
do
	echo $x
done

# Could loop through the result of a call to shell within a shell:
for book in $(ls books/ | grep -i 'air')
```
##### Build a CASE statement
```sh
case 'STRINVAR' in
	PATTERN1)
	COMMAND1;;
	PATTERN2)
	COMMAND2;;
	*)
	DEFAULT COMMAND;;
esac
```

```sh
# Our old IF statement:
if grep -q 'sydney' $1; then
	mv $1 sydney/
fi

if grep -q 'melbourne|brisbane' $1; then
	rm $1
fi

if grep -q 'canberra' $1; then
	mv $1 "IMPORTANT_$1"
fi

# Our new CASE statement
case $(cat $1) in
	*sydney*)
	mv $1 sydney/ ;;
	
	*melbourne|brisbane*)
	rm $1 ;;
	
	*canberra*)
	mv $1 "IMPORTANT_$1" ;;
```

##### Function anatomy
A bash function has the following syntax:
```sh
function function_name (){
	#function code
	return #something
}

# E.g.
temp_f=30
function convert_temp () {
	temp_c=$(echo "scale=2; ($temp_f - 32) * 5 / 9") | bc)
	echo $temp_c
}

convert_temp # call the fucntion
```

- You can use the `local` keyword to restrict variable scope.

```sh
function print_filename {
	local first_filename=$1
}

print_filename "LORT.txt" "model.txt"
```

##### What is cron?
Cron has been part of unix-like systems since the 70's. Humans have been lazy for that long!
The name comes from the Greek word for time, chronos
##### Crontab - the driver of cronjobs
You can see what schedules `cronjobs` are currently programmed using the following command:
`crontab -l`
- There are 5 stars to set, one for each time unit
```sh
# |----------------- minunes (0 - 59)
# | |--------------- hour(0 - 23)
# | | |------------- day of the month (1 - 31)
# | | | |----------- month (1 - 12)
# | | | | |--------- day of the week (0 - 6) (Sunday to Saturday)
# | | | | |
# * * * * * command to execute
```
- The default, **`*`** means 'every'

Let's walk through some cronjob example:
```sh
5 1 * * * bash myscript.sh
- Minutes star is 5 (5 minutes past the hour)
- Hours star is 1 (after 1am). 
- The last three are *, so evevy day and month
- Overall: run every day at 1:05am

15 14 * * 7 bash myscript.sh
- Minutes star is 15 (15 minutes past the hour)
- Hours star is 14 (after 2pm). 
- Next two are *, so every day of month and every month of year
- Last star is day 7 (on Sundays)
- Overall: run at 2:15pm every Sundays
```

If you wanted to run something multiple times per day or every "X" time increments, this is also possible:
- Use a comma for specific intervals. For example:
	- `15,30,45 * * * *` will run at the 15, 30 and 45 minutes mark for whatever hours are specified by the second star. Here it is every hour, every day, etc.
-  Use a slash for every X increment. For example
	- `*/15 * * * *` run every 15 minutes. Also for every hour, day, etc.

In terminal type `crontab -e` to edit your list of cronjobs. Create the cronjob. Save and exit. You will see a message `crontab: installing new crontab`. Check it is there by running `crontab -l`

**Don't try to run the scripts or use crontab. Neither will work.**
A useful tool for constructing crontabs is [https://crontab.guru/](https://crontab.guru/).