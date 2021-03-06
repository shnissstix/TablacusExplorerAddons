var Addon_Id = "touch";

var item = GetAddonElement(Addon_Id);
if (!item.getAttribute("Set")) {
	item.setAttribute("MenuExec", 1);
	item.setAttribute("Menu", "Context");
	item.setAttribute("MenuPos", 1);
	item.setAttribute("MenuName", "Change the Date modified...");

	item.setAttribute("KeyOn", "List");
	item.setAttribute("MouseOn", "List");
}
if (window.Addon == 1) {
	Addons.Touch =
	{
		Exec: function (Ctrl, pt)
		{
			var Selected = GetSelectedArray(Ctrl, pt, true).shift();
			if (Selected && Selected.Count) {
				try {
					var item = Selected.Item(0);
					var ModifyDate = FormatDateTime(item.ModifyDate);
					var s = InputDialog((te.OnReplacePath(item.Path) || item.Path) + (Selected.Count > 1 ? " : " + Selected.Count : "") + "\n" + ModifyDate, ModifyDate);
					if (s) {
						for (var i = Selected.Count; i-- > 0;) {
							if (!SetFileTime(Selected.Item(i).Path, null, null, s)) {
								Selected.Item(i).ModifyDate = s;
							}
						}
					}
				} catch (e) {
					wsh.Popup(e.description + "\n" + s, 0, TITLE, MB_ICONSTOP);
				}
			}
		}
	}

	var s = item.getAttribute("MenuName");
	if (s && s != "") {
		Addons.Touch.strName = GetText(s);
	}
	//Menu
	if (item.getAttribute("MenuExec")) {
		Addons.Touch.nPos = api.LowPart(item.getAttribute("MenuPos"));
		AddEvent(item.getAttribute("Menu"), function (Ctrl, hMenu, nPos, Selected, item)
		{
			if (item && item.IsFileSystem) {
				api.InsertMenu(hMenu, Addons.Touch.nPos, MF_BYPOSITION | MF_STRING, ++nPos, Addons.Touch.strName);
				ExtraMenuCommand[nPos] = Addons.Touch.Exec;
			}
			return nPos;
		});
	}
	//Key
	if (item.getAttribute("KeyExec")) {
		SetKeyExec(item.getAttribute("KeyOn"), item.getAttribute("Key"), Addons.Touch.Exec, "Func");
	}
	//Mouse
	if (item.getAttribute("MouseExec")) {
		SetGestureExec(item.getAttribute("MouseOn"), item.getAttribute("Mouse"), Addons.Touch.Exec, "Func");
	}

	AddTypeEx("Add-ons", "Change the Date modified...", Addons.Touch.Exec);
}
