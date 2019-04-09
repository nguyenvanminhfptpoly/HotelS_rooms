var express = require('express');
var router = express.Router();
var Hotels = require('../modals/hotels');
var Rooms = require('../modals/rooms')
//thư viện multer
var multer = require('multer');
var shortid = require('shortid');
// config noi luu tru va ten anh upload len
var storage = multer.diskStorage({
  // noi luu tru
  destination: function(req, file, cb){
    cb(null, './public/uploads');
  },
  // cau hinh ten file - giu nguyen ten file goc
  filename: function(req, file, cb){
    cb(null, shortid.generate() + "--" + file.originalname);
  }
});

var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {

  Hotels.find({}, (err,data)=>{
    res.render('./hotel/index', { hotels: data });
  })
});
router.get('/hotels/add_form', function(req, res, next) {
  res.render('./hotel/add_form', { title: 'Express' });
});
 router.post('/hotels/add_form', upload.single('image'), (req,res,next)=>{
   var modal = new Hotels();
   modal.name = req.body.name;
   modal.city = req.body.city;
   modal.address = req.body.address;
   modal.ower = req.body.ower;
   modal.license_number = req.body.license_number;
   modal.total_floor = req.body.total_floor;
   modal.image = req.file.path.replace('public', '');

   modal.save((err) => {
     if(err){
       res.send('Luu khong thanh cong');
     }

     res.redirect('/');
   })
 })
router.get('/hotels/edit_form/:name', function(req, res, next) {
  Hotels.findOne({_id: req.params.name}, (err,data)=>{
    if(err){
      res.send('ID khong ton tai');
    }
    res.render('./hotel/edit_form', { hotels: data });
  })
});
 router.post('/hotels/edit_form', upload.single('image'), (req,res,next)=>{
   Hotels.findOne({_id: req.body.id}, (err,modals)=>{
     if(err){
       res.redirect('back');
     }
     modals.name = req.body.name;
     modals.city = req.body.city;
     modals.address = req.body.address;
     modals.ower = req.body.ower;
     modals.license_number = req.body.license_number;
     modals.total_floor = req.body.total_floor;
     if(req.file != null){
       modals.image = req.file.path.replace('public', '');
     }
     modals.save(function(err){
       if(err){
         res.send('Luu khong thanh cong');
       }

       res.redirect('/');
   })
   })
 });

router.get('/hotels/remove/:name', (req, res, next) => {
  Hotels.deleteOne({_id: req.params.name}, (err) => {
    if(err){
      res.send('Xoa khong thanh cong');
    }
    res.redirect('/');
  });
});

router.get('/rooms', function(req, res, next) {
  Rooms.find({})
      .populate('hotelid')
      .exec((err, data) => {
        console.log(data);
        res.render('./rooms/index', { rooms: data });
      });

});
router.get('/rooms/add_form', function(req, res, next) {
  Hotels.find({}, (err,data)=>{
    res.render('./rooms/add_form', { hotels: data });
  })

});
router.post('/rooms/add_form', upload.single('image'), (req,res,next)=>{
  var modal = new Rooms();
  modal.room_number = req.body.room_number;
  modal.floor = req.body.floor;
  modal.hotelid = req.body.hotelid;
  modal.single_rooms = req.body.single_rooms;
  modal.price = req.body.price;
  modal.status = req.body.status;
  modal.detail = req.body.detail;
  modal.image = req.file.path.replace('public', '');
  modal.save((err) => {
    if(err){
      res.send('Luu khong thanh cong');
    }

    res.redirect('/rooms');
  })
})
router.get('/rooms/edit_form/:hotelid',async function(req, res, next) {
  var hotels = await Hotels.find({});

  var rooms = await Rooms.findOne({_id: req.params.hotelid});
  if(hotels == undefined || rooms == undefined){
    res.send('khong co danh muc');
  }
  res.render('./rooms/edit_form', {hotels: hotels, rooms: rooms});

  // Hotels.find({}, (err,data)=> {
  //   Rooms.findOne({_id: req.params.hotelid}, (err, roomsdata) => {
  //     if (err) {
  //       res.send('id san pham khong ton tai');
  //     }
  //
  //     for (var i = 0; i < data.length; i++) {
  //       if (data[i]._id == roomsdata.hotelid.toString()) {
  //         data[i].selected = true;
  //       }
  //     }
  //
  //   })
  // })
});
  router.post('/rooms/edit_form', upload.single('image'), (req, res, next)=>{
    Rooms.findOne({_id: req.body.id}, (err,modal)=>{
      if(err){
        res.redirect('back');
      }
      modal.room_number = req.body.room_number;
      modal.floor = req.body.floor;
      modal.hotelid = req.body.hotelid;
      modal.single_rooms = req.body.single_rooms;
      modal.price = req.body.price;
      modal.status = req.body.status;
      modal.detail = req.body.detail;
      modal.image = req.file.path.replace('public', '');
      modal.save((err) => {
        if(err){
          res.send('Luu khong thanh cong');
        }

        res.redirect('/rooms');
      })
    })
  })

router.get('/rooms/remove/:room_number', (req, res, next) => {
  Rooms.deleteOne({_id: req.params.room_number}, (err) => {
    if(err){
      res.send('Xoa khong thanh cong');
    }
    res.redirect('/rooms');
  });
});
module.exports = router;
