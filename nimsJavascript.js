function downloadToCSV(csv, filename){
	var csvFile;
	csvFile = new Blob([csv], {type: "text/csv"});
	var hiddenElement = document.createElement('a');
    hiddenElement.href = window.URL.createObjectURL(csvFile);
    hiddenElement.download = filename;
    hiddenElement.style.display = 'none';
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
}

var para = document.getElementsByClassName('MsoPlainText');

var begin;
var end;
for(var i=0; i<para.length; i++){
	var text = para[i].innerText;
	if(text.indexOf('MINITRACHEOSTOMY')>=0)
		begin = i;
	else if(text.indexOf('ACCOMMODATION CHARGES W.E.F. 01.09.2006')>=0)
		end = i;
}
var downloadButton = document.createElement('button');
var textNode = document.createTextNode('Download CSV');
downloadButton.appendChild(textNode);
document.body.insertBefore(downloadButton, para[0]);
downloadButton.addEventListener('click',function(){
    var regex = /([A-Z0-9]+)(\s+)([A-Z():/.&\+'\-,a-z0-9() ]+)(\s+)([0-9]+)(\s+)/;
    var csv = [];
    var dept = 'ANAESTHESIOLOGY', code, descr, rate;
    
    for (var j = begin; j < end; j++) {
        var paraText = para[j].innerText;
        if(paraText.indexOf('DEPARTMENT OF NEUROLOGY')>=0)
            dept = 'NEUROLOGY';
        else if(paraText.indexOf('DEPARTMENT OF')>=0){
            dept = paraText.slice(14, paraText.length);
        }
        else if(paraText.indexOf('CODE')>=0)
            continue;
        else if(regex.test(paraText)){
            for(var k=0; k<paraText.length; k++){
                if(paraText[k]===' '){
                    code = paraText.slice(0, k);
                    break;
                }
            }
            var flag=0; 
            var regex1 = /[0-9]/;
            for(var l=paraText.length-1; l>0; l--){
                if(regex1.test(paraText[l]))
                    flag=1;
                if(paraText[l]===' '&&flag===1){
                    rate = paraText.slice(l+1, paraText.length);
                    break;
                }
            } 
            descr = '"'+paraText.slice(k+1, l)+'"';       
            var row = [];        
            row.push(dept,code,descr,rate);
            csv.push(row.join(",")); 
        }
               
    }
    downloadToCSV(csv.join("\n"), 'nims.csv');
});
