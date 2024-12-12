const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Queue = require("./Queue");

const Song = sequelize.define('Song',
    {
        queue_id: {
            type: DataTypes.STRING,
            references: {
                model: Queue,
                key: 'id'
            }
        },
        url: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_globalName: {
            type: DataTypes.STRING
        },
        user_avatar: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        tableName: 'songs',
        timestamps: false
    }
)

Queue.hasMany(Song, { foreignKey: 'queue_id', as: 'songs' });

module.exports = Song;