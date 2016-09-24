var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'provisioner Reports' });
});


/* GET UniqueTestlist page. */
router.get('/Tests', function(req, res) {
    req.collection.distinct('testcase._name', function(err,docs) {
        res.render('tests', {
            'testlist' : docs, title: 'Test Case List'
        });
    });
});

/* GET TestRuns page. */
router.get('/Runs', function(req, res) {
    req.collection.find({}, {sort: {'_id' : -1}} , function(err, runs) {
            res.render('runs', {
                'runs': runs, title: 'Test Run List'
            });
        });
    });

/* GET TestRuns details page. */
router.get('/Run/:run_id', function(req, res) {
    req.collection.findOne({'_run_id': req.params.run_id}, function(err, run) {
        res.render('run', {
            'run': run, title: 'Run Details'
        });
      });
    });

/* GET Test page. */
router.get('/Test/:testname', function(req, res) {
    var testName = req.params.testname;
    req.collection.find({'testcase._name' : testName}, { 'testcase': 1, sort: {'_id' : -1}}, function(err, testlist) {
         res.render('test', {
            'testlist': testlist, 'testname': testName, title: 'Test History'
         });
       });
    });

/* GET InstanceHistory page. */
// Summarize each instance (reportTime) by count of each instanceType
router.get('/InstanceHistory', function(req, res) {
    req.instanceCollection.col.aggregate( [
    { $group : { 
            _id: {time: "$_report_time", type: "$instanceType"}, 
            number: { $sum : 1 } 
        } 
    }, 
    { $group : { 
           _id: "$_id.time", 
           instanceTypes: {$addToSet: {type: "$_id.type", count : "$number"}}
       } 
    },
    { $sort : { '_id': -1  }
    }
    ]
    , function(err,snapshots) {
            res.render('InstanceHistory', {
                'snapshots': snapshots, title: 'Instance History snapshot List'
            });
        });
    });

/* GET InstanceHistorySnapshot details page. */
router.get('/InstancesSnapshot/:report_time', function(req, res) {
    req.instanceCollection.find({'_report_time': req.params.report_time} , function(err, snapshot) {
        res.render('InstanceSnapshot', {
            'snapshot': snapshot, 'report_time': req.params.report_time, title: 'Instance History Snapshot'
        });
      });
    });

/* GET Instance details page. */
router.get('/Instance/:report_time/:instanceId', function(req, res) {
    req.instanceCollection.find({'_report_time': req.params.report_time, 'instanceId':req.params.instanceId}, function(err, instance) {
        res.render('instance', {
            'instance': instance, 'report_time': req.params.report_time, 'instanceId': req.params.instanceId, title: 'Instance Details'
        });
      });
    });
    
/* GET Environments. */
router.get('/Environments', function(req, res) {
     req.environmentCollection.find({}, {sort: {'_id' : -1}} , function(err, environments) {
            res.render('environments', {
                'environments': environments, title: 'Environment List'
            });
        });
    });

/* GET Environments. */
router.get('/Environments/limit/:num', function(req, res) {
    req.environmentCollection.find({}, {sort: {'_id' : -1},limit: req.params.num}, function(err, environments) {
        res.render('environments', {
            'environments': environments, title: 'Environment List'
        });
    });
});

/* GET Environment details page. */
router.get('/Environment/:run_id', function(req, res) {
    req.environmentCollection.findOne({'_run_id': req.params.run_id}, function(err, environment) {
        res.render('environment', {
            'environment': environment, title: 'Environment Details'
        });
      });
    });

/* GET EnvironmentStats page. */
router.get('/EnvStats', function(req, res) {
    req.environmentCollection.col.aggregate( [
            { $group : {
                _id: {time: "$modelName", type: "$setupResult"},
                number: { $sum : 1 }
            }
            },
            { $group : {
                _id: "$_id.time",
                setupResults: {$addToSet: {type: "$_id.type", count : "$number"}}
            }
            },
            { $sort : { '_id': -1  }
            }
        ]
        , function(err,envStats) {
            res.render('envStats', {
                'envStats': envStats, title: 'Environment Stats'
            });
        });
});


/* GET Environment/:model page. */
router.get('/Environments/:model', function(req, res) {
    req.environmentCollection.find({'modelName': req.params.model}, {sort: {'_id' : -1}}, function(err, environments) {
        res.render('environments', {
            'environments': environments, title: 'Environment List for model '+req.params.model
        });
    });
});

/* GET Environments. */
router.get('/Testrunners', function(req, res) {
    req.testrunnerCollection.find({}, {sort: {'_id' : -1}} , function(err, testrunners) {
        res.render('testrunners', {
            'testrunners': testrunners, title: 'TestRunner List'
        });
    });
});


module.exports = router;
