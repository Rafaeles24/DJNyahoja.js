const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Queue extends Model {}

Queue.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    is_playing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    now_playing: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_loop: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    total_songs: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "Queue",
    tableName: "queues",
    timestamps: false
});

module.exports = Queue;