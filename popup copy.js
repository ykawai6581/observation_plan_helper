main();
async function main()
{
	//アクティブなタブを取得
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	//アクティブなタブでJavaScript(parseDOM)を実行
	chrome.scripting.executeScript({
		target:{tabId:tab.id},
		func:create_plan
	}).then(function (r) {
		//実行結果をポップアップウィンドウへ表示
		document.getElementById('result').innerHTML = r[0].result[0];
		document.getElementById('title').innerText = `Observation plan for ${r[0].result[1]}`;

	});
}
function create_plan(){

	const target = document.getElementsByClassName('grid-item grid-item-content')[0].getElementsByTagName('h1')[0].innerText


	var params = document.getElementsByClassName('table code')[0].childNodes[3].children
	var params_sg1 = document.getElementsByClassName('table code')[1].childNodes[3].children
	let param_dict = new Map()

	for (const param of params) { 
		const name = param.cells[0].innerText;
		const value = param.cells[1].innerText; 
		console.log(name,value)
		param_dict.set(name, value)
	}
	
	for (const param of params_sg1) { 
		const name = param.cells[0].innerText;
		const value = param.cells[1].innerText; 
		console.log(name,value)
		param_dict.set(name, value)
	}

	var transit_times = document.querySelector('[title="Observable transit tonight"]').getElementsByTagName('td')
	console.log(transit_times)
	transit_times = Array.from(transit_times).slice(0,3)
	console.log(transit_times)
	let transit_times_array = new Array()

	for (const transit_time of transit_times) { 
		const value = transit_time.innerText.slice(11,16); 
		const obsyear = transit_time.innerText.slice(0,5)
		const obsmonth = transit_time.innerText.slice(6,8)
		const obsdate = transit_time.innerText.slice(9,10)
		console.log(obsyear,obsmonth,obsdate)
		console.log(value)
		transit_times_array.push(value)
	}

	const target_priority = `${target} (Priority ${param_dict.get('Priority')})`
	const ra_dec = `RA, Dec:  ${param_dict.get('RA')} ${param_dict.get('Dec')}`
	const transit_begin_end = `Transit times: ${transit_times_array[0]} - ${transit_times_array[2]} UT (${param_dict.get('Acc period error').slice(0,7)})`
	const obs_times = `Obs times: `
	const _focus = `Focus: `
	const exptimes = `Exp times: `
	const depth =  `Depth: ${param_dict.get('Depth')}`
	const vmag = `Vmag: ${param_dict.get('V mag')}`
	const comments = `Comments: `

	var plan_content = 
`
${target_priority} 
${ra_dec} 
${transit_begin_end} 
${obs_times} 
${depth}
${vmag}
${comments}
`
	
	return [plan_content, target];
}

$( function() {
    $('#ajax-button').click(
    function() {
        var hostUrl= 'http://localhost:8000';
        var param1 = 1;
        var param2 = 10;
        $.ajax({
            url: hostUrl,
            type:'POST',
            dataType: 'json',
            data : {
				"action": showImage,
				"form[mode]": 1,
				"form[day]": 29,
				"form[month]": 11,
				"form[year]": 2022,
				"form[obs_name]": "Roque de los Muchachos Observatory (La Palma, Spain)",

				"form[coordlist]": coord,
				"coordfile": "(binary)",
				"form[paramdist]": 2,
				"form[minangle]": 10,
				"form[format]": "gif",
				"submit": " Retrieve ",
				}
				,
            timeout:3000,
        }).done(function(data) {
                          alert("ok");
        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
                         alert("error");
        })
    });
} );
