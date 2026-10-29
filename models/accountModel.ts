import { pool } from '../configs/db'

const validateSignUp = function (username: any, password: any, passwordConfirm: any) {
    if (username.length < 6 || password !== passwordConfirm || username.includes(" ") || password.includes(" ")) {
        return 1
    } else {
        return 0
    }
}

export const authSignUp = function (res: any, req: any) {
    const { username, password, passwordConfirm } = req.body
    res.set('Cache-Control', 'no-store')

    if (validateSignUp(username, password, passwordConfirm)) {
        res.send({
            status: false,
            message: 'Follow the conditions for the username and password above please.'
        })
        return
    }

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err)
            res.status(500).send({ status: false, message: 'Unable to create account.' })
            return
        }

        connection.query('SELECT id FROM accounts WHERE username = ? LIMIT 1', [username], function (selectErr: any, result: any) {
            if (selectErr) {
                connection.release()
                console.error('Query error:', selectErr)
                res.status(500).send({ status: false, message: 'Unable to create account.' })
                return
            }

            if (result.length > 0) {
                connection.release()
                res.send({ status: false, message: 'It already exists.' })
                return
            }

            const insertQuery = `INSERT INTO accounts (username, password, createdAt) VALUES (?, ?, ?)`
            const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
            connection.query(insertQuery, [username, password, createdAt], function (insertErr: any) {
                connection.release()
                if (insertErr) {
                    console.error('Query error:', insertErr)
                    res.status(500).send({ status: false, message: 'Unable to create account.' })
                    return
                }

                res.send({ status: true, message: 'Successfully signed up.' })
            })
        })
    })
}

export const authSignIn = function (res: any, req: any) {
    const { username, password } = req.body
    res.set('Cache-Control', 'no-store')

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err)
            res.status(500).send({ status: false, message: 'Unable to sign in.' })
            return;
        }

        const signInQuery = 'SELECT id FROM accounts WHERE username = ? AND password = ? LIMIT 1'
        connection.query(signInQuery, [username, password], function (err: any, result: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err)
                res.status(500).send({ status: false, message: 'Unable to sign in.' })
                return;
            }

            res.send(result.length > 0
                ? { status: true, message: 'Successfully signed in.' }
                : { status: false, message: 'You failed to sign in.' })
        })
    })

}

export const cookieValidation = function (res: any, req: any) {
    const { username, password } = req.body
    res.set('Cache-Control', 'no-store')

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err)
            res.status(500).send({ status: false })
            return;
        }

        const query = 'SELECT id FROM accounts WHERE username = ? AND password = ? LIMIT 1'
        connection.query(query, [username, password], function (err: any, result: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err)
                res.status(500).send({ status: false })
                return;
            }

            res.send(result.length > 0
                ? { status: true, username }
                : { status: false })
        })
    })
}

export const getUserDetailsByID = function (res: any, req: any) {

    const selectAccountsQuery = `SELECT * FROM accounts WHERE id = ?`

    const paramsForSelectAccountsQuery = [req.params.id]

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(selectAccountsQuery, paramsForSelectAccountsQuery, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                data: { username: result[0] }
            })
        })
    })

}

export const getUserID = function (res: any, req: any) {

    const selectAccountsQuery = `SELECT id FROM accounts WHERE username = ?`

    const paramsForSelectAccountsQuery = [req.query.username]

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(selectAccountsQuery, paramsForSelectAccountsQuery, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                data: { id: result[0] }
            })
        })
    })

}

export const getUserDetails = function (res: any, req: any) {

    const selectAccountsQuery = `SELECT * FROM accounts 
        WHERE username = ?
    `

    const paramsForSelectAccountsQuery = [req.query.username]

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(selectAccountsQuery, paramsForSelectAccountsQuery, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                userDetails: {
                    username: result[0].username,
                    gender: result[0].gender,
                    country: result[0].country,
                    major: result[0].major,
                    school: result[0].school,
                    snsType: result[0].snsType,
                    url: result[0].url
                }
            })
        })
    })

}

export const updateUserDetails = function (res: any, req: any) {

    const updateAllDetailsQuery = `UPDATE accounts
        SET username = ?,
            gender = ?,
            school = ?,
            country = ?,
            major = ?,
            updatedAt = ?,
            url = ?,
            sns = ?
        WHERE username = ? AND password = ?
    `

    const paramsForUpdateAllDetailsQuery = [req.body.username, req.body.gender, req.body.school, req.body.country, req.body.major, new Date().toISOString().slice(0, 19).replace('T', ' '), req.body.url, req.body.snsType, req.body.username, req.body.password]

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(updateAllDetailsQuery, paramsForUpdateAllDetailsQuery, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            if (result.changedRows === 0) {
                res.send({
                    status: false,
                    message: "Either username or password is not matching."
                })
            } else {
                res.send({
                    status: true,
                    message: "You have successfully updated the details."
                })
            }
        })
    })

}

export const getAllUsers = function (res: any, req: any) {

    const getAllUsers = `SELECT id, username, gender, country, major, school, createdAt, url, sns FROM accounts`

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(getAllUsers, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                data: result
            })
        })
    })

}

export const getUserCommentDetails = function (res: any, req: any) {

    const getUserCommentDetails = `SELECT m.id, m.name, COUNT(a.username) AS count FROM comments c
        INNER JOIN majors m on m.id = c.majorID
        INNER JOIN accounts a on a.id = c.userID
        WHERE c.userID = ?
        GROUP BY m.id
    `

    const paramForGetUserCommentDetails = [req.params.id]

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(getUserCommentDetails, paramForGetUserCommentDetails, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                data: result
            })
        })
    })

}

export const getUserModuleCommentDetails = function (res: any, req: any) {

    const query = `SELECT m.id, m.name, COUNT(a.username) AS count FROM moduleComments c
        INNER JOIN modules m on m.id = c.moduleID
        INNER JOIN accounts a on a.id = c.userID
        WHERE c.userID = ?
        GROUP BY m.id
    `

    const param = [req.params.id]

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(query, param, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                data: result
            })
        })
    })

}

export const getTotalAccountCount = function (res: any, req: any) {

    const selectCommentsTableQuery = `SELECT COUNT(*) FROM accounts`

    pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error('DB connection error:', err);
            return;
        }
        connection.query(selectCommentsTableQuery, function (err: any, result: any, fields: any) {
            connection.release()
            if (err) {
                console.error('Query error:', err);
                return;
            }
            res.send({
                status: true,
                message: result
            })
        })
    })

}

