file1 = open('game.js')
file1_contents = file1.read()

file2 = open('domainlock.js')
file2_contents = file2.read()

def get_middle_text(line, string_start, string_end):
	temp = line.split(string_start)[1]
	return temp.split(string_end)[0]

string_start = 'this.START_OBFUSCATION;'
string_end = 'this.END_OBFUSCATION'

result = get_middle_text(file1_contents, string_start, string_end)
result2 = file1_contents.replace(result,file2_contents)

# Cleaning up
result2 = result2.replace(string_start,'')
result2 = result2.replace(string_end,'')
file2.close()
file1.close()

file3 = open('game.js','w')
file3.write(result2)

file3.close()
