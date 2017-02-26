'use strict';

var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = err.errmsg; // 'Cette valeur existe déjà.'; // E11000 duplicate key
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
			}
		}
	}
	return message;
};

exports.find = function(req, res, Model) {	
	Model.find(function(err, data) {
		if (err) {return res.status(400).json(err);}
		res.status(200).json(data);
	});
};

exports.findOne = function(req, res, Model) {
	Model.findOne( { id: req.params.id }, function(err, data) {
				if (err) {return res.status(400).json(err);}
				if (!data) {return res.status(404).json();}
				res.status(200).json(data);
			});
};

exports.createOne = function(req, res, Model) {
	Model.create(req.body, function(err, data) {
		if (err) {
			return res.status(400).json(getErrorMessage(err));
		}
		res.status(201).json(data);
	});
};

exports.deleteOne = function(req, res, Model) {
	Model.findOneAndRemove({ _id: req.params.id }, function(err) {
		if (err) { return res.status(400).json(err);}
		res.status(204).json({status:'deleteOne Ok'});
	});
};

/*
exports.updateOne = function(req, res, Model) {
	console.log('START exports.updateOne  ' + JSON.stringify(req.body) + ' ---- '  + req.params.id);
	Model.findOneAndUpdate({ id: req.params.id }, Model.pays = req.body.pays, {new: true} ,function(err, data) {
		if (err) return res.status(400).json(err);
		if (!data) return res.status(404).json();
		res.status(200).json(data);
		//sendJsonResponse(res, 200, data);
		console.log(' STOP exports.updateOne  ' + JSON.stringify(data));
	});
}; */





