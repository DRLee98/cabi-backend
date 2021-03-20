import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Reply } from '../entities/reply.entity';

@InputType()
export class DeleteReplyInput extends PickType(Reply, ['id']) {}

@ObjectType()
export class DeleteReplyOutput extends CoreOutput {}
