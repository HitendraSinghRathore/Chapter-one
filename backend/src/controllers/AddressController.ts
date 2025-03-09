import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Address } from '../models/Address';
import {sequelize} from '../database/postgres';

export default class AddressController {

  static async createAddress(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      contactName,
      address,
      latitude,
      longitude,
      houseNo,
      area,
      landmark,
      contactNumber,
      instructions,
    } = req.body;
    const userId = req.user && req.user.id ? req.user.id.toString() : '';
    try {
      const newAddress = await Address.create({
        contactName,
        address,
        latitude,
        longitude,
        houseNo,
        area,
        landmark: landmark || null,
        contactNumber: contactNumber || null,
        instructions: instructions || null,
        user: userId,
      });
      return res.status(201).json({
        id: newAddress.id,
        contactName: newAddress.contactName,
        address: newAddress.address,
      });
    } catch (error) {
      console.error('Error while creating address:', error);
      throw error;
    }
  }

  static async updateAddress(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const {
      contactName,
      address,
      latitude,
      longitude,
      houseNo,
      area,
      landmark,
      primary,
      contactNumber,
      instructions,
    } = req.body;
    try {
      const existingAddress = await Address.findByPk(id);
      if (!existingAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
      const userId = req.user && req.user.id ? req.user.id.toString() : '';
      if (existingAddress.user !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this address' });
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData:any = {};
      if (contactName !== undefined) updateData.contactName = contactName;
      if (address !== undefined) updateData.address = address;
      if (latitude !== undefined) updateData.latitude = latitude;
      if (longitude !== undefined) updateData.longitude = longitude;
      if (houseNo !== undefined) updateData.houseNo = houseNo;
      if (area !== undefined) updateData.area = area;
      if (landmark !== undefined) updateData.landmark = landmark;
      if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
      if (instructions !== undefined) updateData.instructions = instructions;
      if (primary !== undefined) updateData.primary = primary;

      await existingAddress.update(updateData);
      return res.status(200).json(existingAddress);
    } catch (error) {
      console.error('Error while updating address:', error);
      throw error;
    }
  }

  static async deleteAddress(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    try {
      const existingAddress = await Address.findByPk(id);
      if (!existingAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
      const userId = req.user && req.user.id ? req.user.id.toString() : '';
      if (existingAddress.user !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this address' });
      }
      await existingAddress.destroy();
      return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error('Error while deleting address:', error);
      throw error;
    }
  }

  static async getAddresses(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user && req.user.id ? req.user.id.toString() : '';
      const addresses = await Address.findAll({
        where: { user: userId },
        attributes: ['id', 'contactName', 'address'],
      });
      return res.status(200).json({
        data: addresses,
      });
    } catch (error) {
      console.error('Error while fetching addresses:', error);
      throw error;
    }
  }

  static async getAddressById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      return res.status(200).json({
        data: address
      });
    } catch (error) {
      console.error('Error while fetching address:', error);
      throw error;
    }
  }
  static async setPrimaryAddress(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const userId = req.user && req.user.id ? req.user.id.toString() : '';
    try {
      const result = await sequelize.transaction(async (t) => {
        const existingAddress = await Address.findByPk(id, { transaction: t });
        if (!existingAddress) {
          return { status: 404, body: { message: 'Address not found' } }; 
        }

        if (existingAddress.user !== userId) {
          return { status: 403, body: { message: 'Not authorized to update this address' } }; 
        }

        // await Address.update({ primary: false }, { where: { user: userId }, transaction: t });
        // await existingAddress.update({ primary: true }, { transaction: t });

        return { status: 200, body: { msg: 'Address set as primary' } }; 
      });

      return res.status(result.status).json(result.body);
      
    } catch (error) {
      console.error('Error while fetching address:', error);
      throw error;
    }
  }
}
