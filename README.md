# 單字練習君
![](https://github.com/YingYingLee/WordExerciser/raw/master/img/001.jpg "單字練習君畫面")

## 目的
可針對自己的程度自訂練習的題目與答案，透過隨機且反覆地練習，加強自身不足的部份。

## 使用說明
* 下載後用瀏覽器開啟`wordExerciser.html`
* 單字的資料儲存在瀏覽器的localStorage裡，只要不清除資料，每次開啟程式時會自動載入，不需要每次重新匯入
* 目前只支援Google Chrome瀏覽器，其他瀏覽器沒特別測試，不保證相容性
* 目前只有繁中版，多語系版暫不考慮
* 文字大小、畫面位置可以調整`wordExerciser.js`裡
```
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
```

## 操作介紹

### 匯入單字
* 可批次匯入，允許的檔案類型為`txt`、`csv`，請參考example裡的檔案(`星期.txt`、`星期.csv`)
* csv存檔類型請選擇以逗號分隔的格式儲存
* 編碼皆為`UTF-8`
* 格式正確的檔案如果匯入失敗，請多試幾次

### 新增單字
* 標題為必填，也是之後練習、操作可以選擇的項目
* 題目和答案為必填、重音為選填
* 滑鼠雙擊表格即可編輯
* 新增列：新增一列表格欄位
* 移除列：選擇想移除的列後點擊此鈕，即可刪除

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/002.jpg "新增單字")

### 修改單字
* 選擇想修改的標題，會列出目前的資料
* 其他操作同新增單字

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/003.jpg "修改單字")

### 刪除單字
* 選擇想刪除的項目，點擊確定鈕，即可將localStorage裡的項目刪除

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/004.jpg "刪除單字")

### 匯出單字
* 選擇想匯出的項目，點擊確定鈕，將會開始下載以項目命名的txt檔，內容為項目裡的單字資料
* 下載的txt檔可供`匯入單字`使用

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/005.jpg "匯出單字")

### 反向
* 提供反向練習
* 不勾選反向，題目區塊會依輸入的題目顯示、答案區塊則需要回答輸入的答案

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/006.jpg "不勾選反向")

* 勾選反向，題目區塊會依輸入的答案顯示、答案區塊則需要回答輸入的題目

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/007.jpg "勾選反向")

### 單字練習
* 可一一鍵入答案後，按`Enter鍵`，正確的話會自動跳下一題，錯誤的話則會用紅字顯示正確答案，再按`Enter鍵`跳下一題
* 也可連續按`Enter鍵`，進行快速地練習

### 圖像練習
* 適合小朋友或剛進新環境的人練習

![](https://github.com/YingYingLee/WordExerciser/raw/master/img/008.jpg "圖像練習")

* 圖片的格式為特殊格式的base64字串，請參考example裡的檔案(`人物.txt`)
* 目前圖片的編輯不太方便，考慮之後提供轉換程式

## 後記
* 主要是個人想學習日文，才會有重音的欄位，相信此工具拿來練習其他語言也是ok的
* 歡迎交流!!
