const Vote = require('./model')
const Kandidat = require('../kandidat/model')
const Voter = require('../user/model')
const fs = require('fs')
const path = require('path')
const config = require('../config')
const { policyFor } = require('../policy')

async function index (req, res, next) {
  try {
    const count = await Vote.find().countDocuments()
    const vote = await Vote.find()
      .populate('kandidat1')
      .populate('kandidat2')
      .populate('voter1')
      .populate('voter2')
      .populate('votedUser')
      .sort({tahun: -1,})
    const suara1 = await Vote.aggregate([ {$project: {jumlah: {$size: '$voter1'}}}])
    const suara2 = await Vote.aggregate([ {$project: {jumlah: {$size: '$voter2'}}}])
      return res.json({
        data: vote,
        count,
        suara1,
        suara2
      })
    
  } catch (err) {
    next(err)
  }
}

async function store (req, res, next) {
  try {
    let payload = req.body
    if (payload.kandidat1) {
      const kandidat1 = await Kandidat.findOne(
        {
          nama: {
            $in: payload.kandidat1,
            
          }
        }
      )
      if (kandidat1) {
        payload = { ...payload, kandidat1: kandidat1.id }
      } else {
        delete payload.kandidat1
      }
    }
    if (payload.kandidat2) {
      const kandidat2 = await Kandidat.findOne(
        {
          nama: {
            $in: payload.kandidat2,
            //$options: 'i'
          }
        }
      )
      if (kandidat2) {
        payload = { ...payload, kandidat2: kandidat2.id }
      } else {
        delete payload.kandidat2
      }
    }
    if (payload.voter1) {
      const voter1 = await Voter.findOne(
        {
          full_name: {
            $in: payload.voter1,
            //$options: 'i'
          }
        }
      ).select('-token -password -createdAt -updatedAt -__v')
      if (voter1) {
        payload = { ...payload, voter1: [voter1.id] }
      } else {
        delete payload.voter1
      }
    }
    if (payload.voter2) {
      const voter2 = await Voter.findOne(
        {
          full_name: {
            $in: payload.voter2,
            //$options: 'i'
          }
        }
      ).select('-token -password -createdAt -updatedAt -__v')
      if (voter2) {
        payload = { ...payload, voter2: [voter2.id] }
      } else {
        delete payload.voter2
      }
    }
    const vote = new Vote(payload)
    await vote.save()
    return res.json(vote)

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      })
    }
    next(err)
  }
}

async function update (req, res, next) {
  try {
    let payload = req.body
    if (payload.vote1) {
      const voter1 = await Voter.findOne(
        {
          nim: {
            $in: payload.vote1,
          }
        }
      ).select('-token')

      const vote = await Vote.findOneAndUpdate(
        { _id: req.params.id }, 
        { $addToSet: { voter1: voter1, votedUser: voter1 }},
        function (error, success) {
          if (error) {
            console.log(error)
          } else {
            console.log('sukses')
          }
        }
      )
  
      await vote.save()
      return res.json(vote)
    }
    
    if (payload.vote2) {
      const voter2 = await Voter.findOne(
        {
          nim: {
            $in: payload.vote2,
          }
        }
      ).select('-token')
      
      const vote = await Vote.findOneAndUpdate(
        { _id: req.params.id }, 
        { $addToSet: { voter2: voter2, votedUser: voter2 }},
        function (error, success) {
          if (error) {
            console.log(error)
          } else {
            console.log('sukses')
          }
        }
      )
  
      await vote.save()
      return res.json(vote)
    }

    if (payload.status) {
      const vote = await Vote.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true }
      )
      await vote.save()
      return res.json(vote)
    }

    if (payload.tampil) {
      const vote = await Vote.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true }
      )
      await vote.save()
      return res.json(vote)
    }
    
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      })
    }
    next(err)
  }
}

async function destroy (req, res, next) {
  try {
    const vote = await Vote.findOneAndDelete({ _id: req.params.id })
    if (vote) {
      return res.json(vote)
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  index,
  store,
  update,
  destroy
}
