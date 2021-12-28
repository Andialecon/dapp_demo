process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'local';


let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/dapp';
}
else {
	urlDB = 'mongodb+srv://andialecon:tejelo2010@cluster0.gptfd.mongodb.net/andino?retryWrites=true&w=majority'
}
 
process.env.URLDB = urlDB