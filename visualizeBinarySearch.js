(function(){
  //テキストエリアに 1-100入力
  var textarea = document.getElementById('textarea');
  InitialInputTextarea(textarea, 1, 100);

  //テキストエリアに値をセット
  var btn_set = document.getElementById('btn-set');
  var in_min = document.getElementById('set-val-min');
  var in_max = document.getElementById('set-val-max');
  abledDisbledBtn(in_min, in_max, btn_set);

  //setボタンがクリックされたら最小値と最大値を取得して、連番をset
  btn_set.onclick = function(){
    var min = in_min.value;
    var max = document.getElementById('set-val-max').value;
    InitialInputTextarea(textarea, min, max);
  }

  //テキストボックス・テキストボックスの入力確認
  var btn = document.getElementById('button');
  var in_target = document.getElementById("target");
  abledDisbledBtn(textarea, in_target, btn);

  //ボタンがクリックされたら
  btn.onclick = function(){
    var strs = textarea.value;
    var search_num = 0;

    //文字列から数字配列へ
    var A = strs2numArray(strs);

    //昇順ソート
    A.sort(compareNumbers);
    function compareNumbers(a, b) {
      return a - b;
    }

    /* A配列を並べる */
    var flex_box = document.getElementById('flex-box');
    redrawArray(flex_box, 'box', A);

    //目標値取得
    var target = Number(in_target.value);

    //二分探索
    var binSearch_result = binary_search(A, 0, A.length-1, target);

    //BinarySearchアニメーション
    animateBinarySearch(binSearch_result, flex_box, document.getElementById('search'));

    // status表示
    var status = document.getElementById('status');
    printStatus(status, binSearch_result);
  }

  /************************* function *****************************************/
  //テキストエリアに 1-100入力
  function InitialInputTextarea(textarea_obj, min, max) {
    var str = "";
    for(var i = min; i <= max; i++){
      str += (i + " ");
    }
    textarea_obj.value = str;
  }

  // 入力されていればボタンを有効に
  function abledDisbledBtn(textarea_obj, input_obj, btn_obj){
    input_obj.onchange = checkInputValue;
    textarea_obj.onchange = checkInputValue;
    function checkInputValue(){
      if ( (textarea_obj.value === '') || (input_obj.value === '') ){
        //ボタン無効
        btn_obj.disabled = "true";
      }else{
        //ボタン有効
        btn_obj.disabled = "";
      }
    }
  }

  function strs2numArray(strs){
    var str_array = strs.replace(/[\,/\|\s]+/g, '<>').split('<>');
    var num_array = new Array();
    for(var i = 0; i < str_array.length; i++){
      if(str_array[i] != ""){
        num_array.push(Number(str_array[i]));
      }
    }
    return num_array;
  }

  // 配列を再描画
  function redrawArray(parent_obj, chilid_class_name, array){
    // clear
    cleardiv(parent_obj);
    for (var i in array){
      var child_class = document.createElement('div');
      child_class.className = chilid_class_name;
      child_class.innerHTML = array[i];
      parent_obj.appendChild(child_class);
    }
  }

  /* BinarySearch
  in:
    array_in 配列
    start_idx 探索範囲(開始位置)
    end_idx 探索範囲(終了位置)
    target 探索したい値

  return:
    flag true 探索値があった false なし
    index 探索値の位置
    array
      array[i]
        start  binarysearchの際の start(left)位置
        middle binarysearchの際の middle位置
        end    binarysearchの際の end(right)位置
  */
  function binary_search(array_in, start_idx, end_idx, target){
    var start = start_idx;
    var end = end_idx;
    var timerid;
    var idx_array = new Array();
    while ((end - start) >= 0){
      var mid = Math.floor((end + start) / 2);
      idx_array.push(
        {
          start: start,
          mid: mid,
          end: end
        }
      );
      if(array_in[mid] === target){
        return {
          flag: true,
          index: mid,
          array: idx_array,
        };
      }else if(array_in[mid] > target){
        end = mid - 1;
      }else {
        start = mid + 1;
      }
    }
    return {
      flag: false,
      index: -1,
      array: idx_array,
    };
  }

  function cleardiv(boxes){
    var child;
    while (child = boxes.firstChild){
      boxes.removeChild(child);
    }
  }

  function animateBinarySearch(bin_s, boxes, base_move){
    var i = 0;
    var timerid;
    //探索回数
    var search_num = document.getElementById('search-num');
    draw();
    function draw(){
      if(i >= bin_s.array.length){
         clearTimeout(timerid);
         return;
      }
      //探索回数表示
      search_num.innerHTML = i + 1;

      //見なくなった left 部分を除去
      for(var s = 0; s < bin_s.array[i].start; s++){
        boxes.childNodes[s].className = "fadeOut";
      }
      //見なくなった right 部分を除去
      for (var e = bin_s.array[i].end + 1; e < boxes.childNodes.length; e++){
        boxes.childNodes[e].className = "fadeOut";
      }
      //start の要素に着色
      boxes.childNodes[bin_s.array[i].start].className = "box start";
      //end の要素に着色
      boxes.childNodes[bin_s.array[i].end].className = "box end";
      //mid の要素に着色
      boxes.childNodes[bin_s.array[i].mid].className = "box mid";
      // 見つけた値を移動
      if(i === (bin_s.array.length - 1)){
        var goal = boxes.childNodes[bin_s.array[i].mid];
        var x = (base_move.offsetLeft + base_move.offsetWidth/2) - goal.offsetLeft;
        var y = (base_move.offsetTop + base_move.offsetHeight/2) - goal.offsetTop;
        goal.style.transform = 'translateX(-50%) translateY(-50%) translateY(2rem)' + 'translateX('+ x +'px) ' + 'translateY('+ y +'px)';
      }
      i++;
      timerid = setTimeout( draw, 2500);
    }
  }

  // Status表示
  function printStatus(status_obj, binSerach_result){
    if (binSerach_result.flag){
      status_obj.style.color = '#33ee33';
      status_obj.innerHTML = 'Success';
    }else{
      status_obj.style.color = '#ee3333';
      status_obj.innerHTML = 'Failed';
    }
  }
})();
