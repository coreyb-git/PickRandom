"use strict";

var const_ListKey = 'PickRandomList';

function Object_Item() {
    this.ListName = '';
}

function Object_List() {
    this.ListName = '';
    this.ItemsArray = [];

    this.NewItem = function(ItemObj) {
        this.ItemsArray.push(ItemObj);
    };

    this.DeleteItem = function(Index) {
        this.ItemsArray.splice(Index, 1);
    };
}

function Object_ListArrayHandler() {
    this.ListArray = [];

    this.AddList = function(ListObj) {
        this.ListArray[this.ListArray.length] = ListObj;
        this.SaveToStore();
    };

    this.DeleteList = function(Index) {
        this.ListArray.splice(Index, 1);
        this.SaveToStore();
    };

    this.UpdateList = function(Index, ListObj) {
        if (Index > -1) {
            this.ListArray[Index] = ListObj;
            this.SaveToStore();
        }
    };

    this.GetListObject = function(Index) {
        if ((Index > -1) && (Index < this.ListArray.length)) return this.ListArray[Index];
        else return new Object_List();
    };

    this.LoadFromStore = function() {
        this.ListArray = [];
        var s = localStorage.getItem(const_ListKey);
        if ((s !== '') && (s !== null)) this.ListArray = JSON.parse(s);
    };

    this.SaveToStore = function () {
        if (this.ListArray.length == 0) {
            localStorage.removeItem(const_ListKey);
        } else {
            var s = JSON.stringify(this.ListArray);
            localStorage.setItem(const_ListKey, s);
        }
    };

    this.LoadFromStore();
}

var ListHandler;

function getSelectedListIndex() {
    return document.getElementById('SelectList').options.selectedIndex;
}

function SelectedChanged() {
    UpdateListItems();
}

function UpdateSelectList() {
    var s = '';
    for (var c = 0; c < ListHandler.ListArray.length; c++) {
        s += '<option value="' + c + '">' + ListHandler.ListArray[c].ListName + '</option>';
    }
    document.getElementById('SelectList').innerHTML = s;
    UpdateListItems();
    SelectedChanged();
}

function UpdateListItems() {
    var e = document.getElementById('ListItems');
    var List = ListHandler.GetListObject(getSelectedListIndex());
    var s = '';
    for (var c = 0; c < List.ItemsArray.length; c++) {
        s = s + '<option value="' + c + '">' + List.ItemsArray[c].ListName + '</<option>';
    }
    e.innerHTML = s;
}


function AddNewList() {
    var e = document.getElementById('NewListName');
    var List = new Object_List();
    List.ListName = e.value;
    e.value = '';
    ListHandler.AddList(List);
    UpdateSelectList();
}

function DeleteList() {
    ListHandler.DeleteList(getSelectedListIndex());
    UpdateSelectList();
}

function AddNewListItem() {
    var e = document.getElementById('NewListItem');
    var Item = new Object_Item();
    Item.ListName = e.value;
    e.value = '';
    var List = ListHandler.GetListObject(getSelectedListIndex());
    List.NewItem(Item);
    ListHandler.UpdateList(getSelectedListIndex(), List);
    UpdateListItems();
}

function DeleteListItem() {
    var SelectedList = getSelectedListIndex();
    var SelectedItem =  document.getElementById('ListItems').options.selectedIndex;
    var List = ListHandler.GetListObject(SelectedList);
    List.DeleteItem(SelectedItem);
    ListHandler.UpdateList(SelectedList, List);
    UpdateListItems();
}

function Dev_ClearLocalStore() {
    localStorage.removeItem(const_ListKey);
}

function Do_Init() {
    ListHandler = new Object_ListArrayHandler();
    UpdateSelectList();
    window.location = '#Main';
}