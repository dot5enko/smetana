
### Smetana 
browser extension that helps solana developers easilly explore and debug their accounts without leaving explorer pages

![image](https://github.com/dot5enko/smetana/blob/master/screen.png?raw=true)

### Features

- [x] explore any borsh encoded accounts on popular explorers
	- [x] solscan
	- [x] solanafm
	- [x] explorer solana
- [x] auto import IDL from anchor idl repository
- [x] import your IDL from *.json file
- [x] create your own structures for any data
	- [ ] nested structures support
	- [ ] convenient data layout constructor for unknown data
- [x] edit imported IDL types layout
- [x] account data watch ( periodically fetch data for given accounts)
- [ ] create data insigths from series of data, charts, data panels 
	- [ ] share your insights link
	- [ ] data inshights dashboard 
- [ ]  create alerts on data changes
- [ ] extension multiple language support
	- [x] english
	- [ ] spanish
	- [ ]  chinese 
- [x] extension rpc configuration
- [ ] autodetect explorer solana network cluster
- [x] change appearance of addresses across all explorers  (addresbook)
- [ ] rich solana native program types support
	- [x] spl token account
	- [x] spl mint 
	   

### Quick Start

 1. build from source or choose prebuilt from **

```
yarn build
```
2. import unpacked extension at **dist** to your chromium-based browser
3.  navigate to desired solana explorer and open any transaction
4. click on any [ S ] button appeared
5. enjoy!