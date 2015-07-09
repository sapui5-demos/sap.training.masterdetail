sap.ui.define([
		"sap/training/masterdetail/controller/BaseController",
		"sap/training/masterdetail/model/formatter"
	], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("sap.training.masterdetail.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path
		 */
		_onObjectMatched: function(oEvent) {

			var sObjectPath = "/Products(" + oEvent.getParameter("arguments").objectId + ")";

			this._bindView(sObjectPath);
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 */
		_bindView: function(sObjectPath) {

			var oView = this.getView();

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "Supplier"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oView.setBusy(true);
					},
					dataReceived: function() {
						oView.setBusy(false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath();
			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

		}

	});

});