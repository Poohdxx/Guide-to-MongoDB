const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
    let joe;
    beforeEach((done) => {
        joe = new User({name: 'Joe', likes : 0});
        joe.save()
            .then(() => done());
    });

    function assertName(operation, done) {
        operation
            .then(() => User.find({}))
            .then((users) => {
                assert(users.length === 1);
                assert(users[0].name === 'Alex');
                done();
            });
    }
    
    it('instance type using set n save', (done) => {
        joe.set('name', 'Alex'); //only change in memory, NOT in database
        assertName(joe.save(), done); //when .save() change happens in database
    });

    it('A model instance can update', (done) => {
        assertName(joe.update({name: 'Alex'}), done);
    });

    it('A model class can update', (done) => {
        assertName(User.update({name: 'Joe'}, {name: 'Alex'}), done);
    });

    it('A model class can update on record', (done) => {
        assertName(User.findOneAndUpdate({name: 'Joe'}, {name: 'Alex'}), done);
    });

    it('A model class can find a record with an Id and update', (done) => {
        assertName(User.findByIdAndUpdate(joe._id, {name: 'Alex'}), done);
    });

    it('A user can have their postcount incremented by 1', (done) => {
        User.update({name:'Joe'}, {$inc: {likes: 10}})  // change on database NOT in memory
            .then(() => User.findOne({name:'Joe'}))
            .then((user) => {
                assert(user.likes === 10);
                // console.log(joe.postCount); // 0
                done();
            });
    });
});