import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../Prisma/prisma.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService){}
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto
    });
    return product;
  }
   

async findAll(paginationDto: PaginationDto) {
  const { page = 1, limit = 10 } = paginationDto;

  const totalProducts = await this.prisma.product.count({
    where: { available: true }
 } );
  
  const lastPage = Math.ceil(totalProducts / limit);

  return {
    data: await this.prisma.product.findMany({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    meta: {
      total: totalProducts,
      page: page,
      lastPage: lastPage,
    },
  };
}
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id , available: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

 async update(id: number, updateProductDto: UpdateProductDto) {
    const {id:___, ...data} = updateProductDto;
  await this.findOne(id); 
    return this.prisma.product.update({
      where: { id: id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    //hard delete
  /*  return this.prisma.product.delete({
      where: { id: id },
    });
    */
    //soft delete
    
    const product = await this.prisma.product.update({
      where: { id: id },
     data: {
       available: false,
     },
    });
    return {
      status: 200,
      msg: 'product deleted successfully',
      product: product,

    }
}
}
