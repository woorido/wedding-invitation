import { json } from '@sveltejs/kit';
import { getGuestbookCollection } from '$db/mongo';
import { ObjectId } from 'mongodb';

export async function GET() {
	const collection = await getGuestbookCollection();
	const guestbooks = await collection.find({}).project({ password: 0 }).toArray();
	return json({
		guestbooks
	});
}

export async function POST({ request }) {
	const collection = await getGuestbookCollection();
	const data = await request.json();
	data.date = new Date();
	const res = await collection.insertOne(data);
	console.log(res.insertedId);

	return json({
		insertedId: res.insertedId,
		date: data.date
	});
}

export async function DELETE({ request }) {
	const collection = await getGuestbookCollection();
	const data = await request.json();
	const res = await collection.deleteOne({ _id: new ObjectId(data._id), password: data.password });

	let isUpdated: boolean = res.deletedCount > 0 ? true : false;

	return json({
		insertedId: data._id,
		isUpdated: isUpdated
	});
}

export async function PUT({ request }) {
	const collection = await getGuestbookCollection();
	const data = await request.json();
	const res = await collection.updateOne(
		{ _id: new ObjectId(data._id), password: data.password },
		{ $set: { message: data.message } }
	);

	let isUpdated: boolean = res.matchedCount > 0 ? true : false;

	return json({
		insertedId: data._id,
		message: data.message,
		isUpdated: isUpdated
	});
}
