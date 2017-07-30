function resize() {
	let height = window.innerHeight ? window.innerHeight : $(window).height();
	let width = window.innerWidth ? window.innerWidth : $(window).width();
	
	gVar.wrapper.css({
		"height": (height - 60) + "px",
		"width": (width * 0.8) + "px"
	});
	
	let style = {
		"font-size": (height * 0.2) + "px",
		"height": (height * 0.3) + "px"
	};
	
	gVar.txaQuestion.css(style);
	gVar.txaAnswer.css(style);
	
	gVar.divAccent.css({
		"font-size": (height * 0.08) + "px",
		left: (width * 0.83) + "px",
		top: (height * 0.07) + "px"
	});
}

function appendOption(value, text) {
	gVar.selectTitle.append($("<option></option>").attr("value", value).text(text))
					.selectmenu("refresh");
}

function getLocalStorage() {
	let storage;
		
	if (!localStorage["WordExerciser"]) {
		storage = [];
	} else {
		storage = JSON.parse(localStorage["WordExerciser"]);
	}
	return storage;
}

function saveLocalStorage(fileName) {
	return new Promise(function(resolve, reject) {
		
		let storage = getLocalStorage();
		let index = 0;
		let isUpdate = false;
		let savaData = null;
		
		for (let i = 0, j = storage.length; i < j; i++) {
			if (storage[i]["title"] === fileName) {
				index = i;
				isUpdate = true;
				savaData = storage[i];
				savaData["content"].length = 0;
				break;
			}
		}
		
		if (!savaData) {
			savaData = {
				title: fileName,
				content: []
			};
		}
		
		try {
			let line = gVar.fileData[fileName].split("\r\n");
		
			for (let value of line) {
				if (value.trim().length > 0) {
					let data = value.split(",");
					let topic = {
						question: data[0],
						answer: data[1],
						accent: data[2] || null
					};
					savaData["content"].push(topic);
				}
			}
			
			if (isUpdate) {
				storage[index] = savaData;
			} else {
				storage.push(savaData);
			}
			
			localStorage["WordExerciser"] = JSON.stringify(storage);
			resolve("");
			return;
		} catch (error) {
			console.log(error);
			resolve("發生錯誤，請再匯一次: " + fileName);
			return;
		}
	});
}

function readFile(file) {
	return new Promise(function(resolve, reject) {
		let fileName = file.name;
		
		if (fileName.match(/(.txt|.csv)$/)) {
			fileName = fileName.substring(0, fileName.indexOf("."));
			
			let fileReader = new FileReader();
			fileReader.onload = function(event) {
				gVar.fileData[fileName] = event.target.result;
			};
			
			$.when(fileReader.readAsText(file, "UTF-8"))
			.then(function() {
				saveLocalStorage(fileName).then(function(result) {
					
					if (result.length === 0 && 
						gVar.selectTitle.find("[value=" + fileName + "]").length === 0) {
						appendOption(fileName, fileName);
					}
					resolve(result);
				});
			});
		} else {
			resolve("可匯入的檔案類型為txt, csv: " + fileName);
		}
	});
}

function playShuffle() {
	let length = gVar.words.length;
	let randomNum = Math.floor(Math.random() * length);
	let isReverse = gVar.chkReverse.prop("checked");
	let topic = gVar.words[randomNum];
	
	let tmpAnswer = isReverse ? topic["question"] : topic["answer"];
	
	if (tmpAnswer === gVar.hdnAnswer && length > 1) {
		playShuffle();
	} else {
		let tmpQuestion = isReverse ? topic["answer"] : topic["question"];
		
		if (tmpQuestion.match(/^image:/)) {
			tmpQuestion = tmpQuestion.substring(tmpQuestion.indexOf(":") + 1);
			tmpQuestion = "data:image/png;base64," + tmpQuestion;
			gVar.txaQuestion.val("").css("background-image", "url(" + tmpQuestion + ")");
		} else {
			gVar.txaQuestion.val(tmpQuestion).css("background-image", "");
		}
		
		gVar.hdnAnswer = tmpAnswer;
		gVar.txaAnswer.val("").attr("placeholder", "請按Enter").css("background-image", "");
		if (topic["accent"]) {
			gVar.divAccent.text(topic["accent"]).show();
		}
	}
}

function reset(param) {
	if (param) {
		gVar.selectTitle.val("").selectmenu("refresh");
	}
	gVar.words.length = 0;
	gVar.txaQuestion.val("").css("background-image", "");
	gVar.hdnAnswer = "";
	gVar.txaAnswer.val("").attr("placeholder", "").css("background-image", "");
	gVar.divAccent.text("").hide();
}

function showMessage(msg) {
	let div = $('<div id="message" title="訊息">' + msg + '</div>');
	let dialog = div.dialog({
		modal: true,
		resizable: false,
		height: "auto",
		width: 350,
		buttons: [{
			text: "關閉",
			click: function() {
				div.dialog("close");
			}
		}],
		close: function() {
			div.dialog("destroy");
			div.remove();
		}
	});
	
	dialog.dialog("open");
}

function confirmMessage(msg) {
	return new Promise(function(resolve, reject) {
		let div = $('<div id="message" title="訊息">' + msg + '</div>');
		let dialog = div.dialog({
			modal: true,
			resizable: false,
			height: "auto",
			width: 350,
			buttons: [{
				text: "確定",
				click: function() {
					resolve(true);
					div.dialog("close");
				}
			}, {
				text: "取消",
				click: function() {
					resolve(false);
					div.dialog("close");
				}
			}],
			close: function() {
				div.dialog("destroy");
				div.remove();
			}
		});
		
		dialog.dialog("open");
	});
}

function convertAndSaveData(title) {
	
	let data = "";
	
	$(".clickable").each(function() {
		let _this = $(this);
		let question = _this.find("td:eq(0)").text();
		let answer = _this.find("td:eq(1)").text();
		let accent = _this.find("td:eq(2)").text();
		
		if (question.length > 0 && answer.length > 0) {
			data += question + "," + answer;
			if (accent.length > 0) {
				data += "," + accent;
			}
			data += "\r\n";
		}
	});
	
	gVar.fileData[title] = data;
	
	saveLocalStorage(title).then(function(result) {
		if (result.length === 0 && 
			gVar.selectTitle.find("[value=" + title + "]").length === 0) {
			appendOption(title, title);
		}
		gVar.fileData = {};
		reset(true);
	});
}

function buildTable(type) {
	
	let header = ["*題目", "*答案", "重音"];
	let hData = "";
	let rData = "";
	
	hData += "<tr>";
	for (let h of header) {
		hData += "<th>" + h + "</th>";
	}
	hData += "</tr>";
	
	if (type === "add") {
		rData += '<tr class="clickable">';
		for (let i = 0, j = header.length; i < j; i++) {
			rData += '<td class="editable"></td>';
		}
		rData += '</tr>';
	} else {
		let storage = getLocalStorage();
		let title = $("#title").val();
		
		for (let s of storage) {
			if (s["title"] === title) {
				for (let c of s["content"]) {
					rData += '<tr class="clickable">';
					rData += '<td class="editable">' + c["question"] + '</td>';
					rData += '<td class="editable">' + c["answer"] + '</td>';
					rData += '<td class="editable">' + (c["accent"] || "") + '</td>';
					rData += '</tr>';
				}
				break;
			}
		}
	}
	
	$(".dialog-table").append(hData).append(rData);
	return header;
}

function editWords(type) {
	
	let storage = getLocalStorage();
	
	if (type === "edit" && storage.length === 0) {
		showMessage("沒有可修改的項目");
		return;
	}
	
	let header = [];
	let div = $('<div></div>');
	let dialog = div.dialog({
		autoOpen: false,
		buttons: [{
			text: "新增列",
			click: function() {
				let rData = '<tr class="clickable">';
				for (let i = 0, j = header.length; i < j; i++) {
					rData += '<td class="editable"></td>';
				}
				rData += '</tr>';
				$(".dialog-table tr:last").after(rData);
			}
		}, {
			text: "移除列",
			click: function() {
				if ($(".clickable").length === 1) {
					showMessage("不能刪除最後一個項目");
				} else {
					$(".tr-clicked").remove();
				}
			}
		}, {
			text: "確定",
			click: function() {
				let title = $("#title").val();
				if (title.length === 0) {
					showMessage("標題不可為空");
					return;
				} else {
					let isExist = false;
					
					for (let s of storage) {
						if (s["title"] === title) {
							isExist = true;
							break;
						}
					}
					
					if (type === "add" && isExist) {
						confirmMessage("此標題已存在，是否覆蓋?").then(function(result) {
							if (result) {
								convertAndSaveData(title);
								div.dialog("close");
							}
						});
					} else {
						convertAndSaveData(title);
						div.dialog("close");
					}
				}
			}
		}, {
			text: "取消",
			click: function() {
				div.dialog("close");
			}
		}],
		close: function() {
			div.dialog("destroy");
            div.remove();
		},
		closeOnEscape: false,
        height: 450,
        modal: true,
        resizable: true,
        title: (type === "add") ? "新增單字" : "修改單字",
        width: 400
	});
	
	let title = $('<div></div>');
	title.append($('<div class="dialog-div">標題: </div>'));
	
	let table = $('<table class="dialog-table"></table>');
    div.append(title).append(table);
	
	if (type === "add") {
		title.append($('<input type="text" id="title" />'));
		header = buildTable(type);
	} else {
		let select = $('<select id="title"></select>');
		title.append(select);
		
		select.selectmenu({
			change: function() {
				
				table.find("tr").each(function() {
					$(this).remove();
				});
				
				if (this.value.length > 0) {
					header = buildTable(type);
				}
			}
		});
		
		select.append($("<option></option>").attr("value", "").text("-----請選擇-----"));
		
		for (let s of storage) {
			select.append($("<option></option>").attr("value", s["title"]).text(s["title"]));
		}
		select.selectmenu("refresh");
	}
    
    dialog.dialog("open");
}

function deleteOrExportWords(type) {
	
	let storage = getLocalStorage();
	
	if (storage.length === 0) {
		if (type === "delete") {
			showMessage("沒有可刪除的項目");
		} else {
			showMessage("沒有可匯出的項目");
		}
		return;
	}
	
	let div = $('<div></div>');
	let dialog = div.dialog({
		autoOpen: false,
		buttons: [{
			text: "確定",
			click: function() {
				
				if ($(".items:checked").length === 0) {
					if (type === "delete") {
						showMessage("請至少選擇一個要刪除的項目");
					} else {
						showMessage("請至少選擇一個要匯出的項目");
					}
					return;
				}
				
				reset(true);
				
				$(".items").each(function() {
					if ($(this).prop("checked")) {
						
						let dataValue = this.getAttribute('data-value');
						
						if (type === "delete") {
							if (dataValue === "all") {
								localStorage.removeItem("WordExerciser");
								gVar.selectTitle.empty();
								appendOption("", "-----請選擇-----");
								return false;
								
							} else {
								let index = -1;
								for (let i = 0, j = storage.length; i < j; i++) {
									if (storage[i]["title"] === dataValue) {
										index = i;
										break;
									}
								}
								if (index > -1) {
									storage.splice(index, 1);
									localStorage["WordExerciser"] = JSON.stringify(storage);
									gVar.selectTitle.find("[value=" + dataValue + "]").remove();
								}
							}
							gVar.selectTitle.selectmenu("refresh");
							
						} else {
							
							if (dataValue !== "all") {
								let data = "";
								for (let s of storage) {
									if (s["title"] === dataValue) {
										for (let c of s["content"]) {
											data += c["question"] + "," + c["answer"];
											if (c["accent"]) {
												data += "," + c["accent"];
											}
											data += "\r\n";
										}
										break;
									}
								}
								
								let link = document.createElement("a");
								link.download = dataValue + ".txt";
								link.href = "data:," + encodeURIComponent(data);
								link.click();
							}
						}
					}
				});
				
				div.dialog("close");
			}
		}, {
			text: "取消",
			click: function() {
				div.dialog("close");
			}
		}],
		close: function() {
			div.dialog("destroy");
            div.remove();
		},
		closeOnEscape: false,
        height: 450,
        modal: true,
        resizable: true,
        title: (type === "delete") ? "刪除單字" : "匯出單字",
        width: 300
	});
	
	let content = $('<div></div>');
	div.append(content);
	
	if (type === "delete") {
		content.append($('<div class="dialog-div">請選擇要刪除的項目:</div>'));
	} else {
		content.append($('<div class="dialog-div">請選擇要匯出的項目:</div>'));
	}
	
	content.append($('<label for="all">全選</label>'))
		.append($('<input type="checkbox" id="all" class="items" data-value="all">'));
	
	for (let i = 0, j = storage.length; i < j; i++) {
		let title = storage[i]["title"];
		content.append($('<label for="item-' + i + '">' + title + '</label>'))
			.append($('<input type="checkbox" id="item-' + i + '" class="items" data-value="' + title + '">'));
	}
	
	content.controlgroup({
		direction: "vertical"
	});
	
	$("#all").change(function() {
		let value = $(this).prop("checked") ? "checked" : "";
		
		$(".items").each(function() {
			if (this.getAttribute('data-value') !== "all") {
				let _this = $(this);
			
				_this.checkboxradio("enable").prop("checked", value).change();
				
				if (value === "checked") {
					_this.checkboxradio("disable");
				}
			}
		});
	});
		
	dialog.dialog("open");
}