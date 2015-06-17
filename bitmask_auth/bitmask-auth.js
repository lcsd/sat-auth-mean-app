/*jshint bitwise: false, asi: true, maxlen: 72, indent: 2*/
/**
 * bmAuth - BitMask Authorization (v0.1.0)
 * https://github.com/lcsd/bitmask-auth
 * https://en.wikipedia.org/wiki/bitmask
 *
 * bmAuth uses bitmasks for up to 32 named roles
 * 
 * Four predefined roles ('admin,user,oper,edit')
 * Up to 28 more user roles may be defined by application
 * Roles are cumulative (ex: roles for a tech blog)
 *	user:  user is authenticated
 * 	admin: user has administrator rights
 *	oper:  user can comment or edit data
 *	edit:  user can edit or publish
 *	other roles: define sections for restricted access
 * 
 * User Roles define RIGHTS | Access Roles set RESTRICTIONS
 * 
 * Roles are defined by an array or comma delimited list of items
 *		ex: roles_str = 'user, edit' <=> roles_msk = 2+8 = 10
 *		ex: roles_arr = ['user','edit']   <=>  roles_msk = 10
 * Masks are bitsets representation of roles
 * 		ex: bmAuth.toMask('user,edit') => 10
 * 		ex: bmAuth.toString(10) => 'user,edit'
 * 		ex: bmAuth.toArray(10) => ['user','edit']
 * 
 * Usage:
 * 1) Call bmAuth.config(usrRoles) to setup aditional user roles
 * 2) bmAuth supports conversion between Roles representations
 *        (roles_str <=> roles_arr <=> roles_mskMask)
 * 
 * 3) usrMask: mask of Roles the User HAS (rights)
 * 4) accMask: mask of roles the User MUST HAVE (restrictions)
 * 
 * 5) Granted access if (accMask & usrMask === accMask)
 * 
 * Copyright 2015  Luiz Domingues
 * Released under the MIT license
 */
//
(function (factory) {
	if (typeof exports === 'undefined') {
		factory(this.bmAuth = {}) // Browser global (bmAuth)
	} else {
		factory(module.exports)		// Node require(./bitmask-auth)
	}
}(function ($) {
	var
		sysroles	= ['admin', 'user', 'oper', 'edit'],
		usrroles	= [],						// user defined roles (max 28)
		maxuroles = 32 - sysroles.length,
		allroles	= sysroles;			// default roles definition array
	//
	$.ALLMASK		= -1;
	$.PUBMASK		= 0;
	$.ADMMASK		= 1;
	$.USRMASK		= 2;
	$.SYSMASK		= Math.pow(2, sysroles.length) - 1;
	$.USRMASK		= ~$.SYSMASK;
	/**
	 * config user roles
	 * @param {Array|String} uroles User defined roles (array or list)
	 */
	$.config		= function(uroles) {
		if (Array.isArray(uroles)) {
			usrroles	= uroles
		} else if (typeof(uroles) === 'string') {
			uroles = uroles.replace(/\s/g, '') 		// remove spaces
			usrroles	= uroles.split(',')
		} else { usrroles = [] }
		if (usrroles.length > maxuroles) { 
			usrroles.splice(maxuroles, Number.MAX_VALUE)
		}
		allroles = sysroles.concat(usrroles)
    return allroles
	}
	/**
	 * mask to array of roles
	 * @param   {Number} mask   roles bitset mask
	 * @param   {Array}  roles  roles definition array
	 * @returns {Array}  array  representation of mask
	 */
	$.toArray  = function(mask, roles) {
		mask = parseInt(mask) || 0;
		if (!mask) { return [] }
    if (!Array.isArray(roles)) { roles = allroles }
		var imask = 1, maskArr = [];
		for (var i = 0, n = roles.length; i < n; i++) {
			if (imask & mask) { maskArr.push(roles[i]) }
			imask = imask << 1
		}
		return maskArr
	}
	/**
	 * mask to string list of roles
	 * @param   {Number} mask roles bitset representation
	 * @param   {Array}  roles  roles definition array
	 * @returns {String} string list representation of roles
	 */
	$.toString = function(mask, roles) {
		return $.toArray(mask, roles).toString()
	}
	/**
	 * roles list or array to mask
	 * @param   {String|Array}  maskPrm  array or list of roles
	 * @param   {Array}  roles  roles definition array
	 * @returns {Number}	      bitmask representation of roles
	 */
	$.toMask   = function(maskPrm, roles) {
		if (typeof(maskPrm) === 'string') {
			maskPrm = maskPrm.split(',') 		// string list to array
		}
		if (!Array.isArray(maskPrm)) { return 0 }
    if (!Array.isArray(roles)) { roles = allroles }
		var mask = 0, imask = 1;
		for (var i = 0, n = roles.length; i < n; i++) {
			if (maskPrm.indexOf(roles[i]) !== -1) {
				mask = mask | imask
			}
			imask = imask << 1
		}
		return mask
	}
}))
