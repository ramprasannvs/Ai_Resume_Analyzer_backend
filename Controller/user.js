const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if user already exists
        let userExist = await UserModel.findOne({ email });

        if (!userExist) {
            let user = new UserModel({
                name,
                email,
                photoUrl
            });
            await user.save();

            res.status(201).json({ message: 'User registered successfully', user });
        }
        return res.status(200).json({ message: "Welcome Back", user: userExist });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error', message: err.message });
    }
};
