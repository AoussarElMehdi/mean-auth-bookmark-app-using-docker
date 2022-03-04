import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
    constructor(@Inject('BOOKMARK_SERVICE') private readonly client: ClientKafka) { }

    getHello(): string {
        return 'Hello World!';
    }

    testKafka() {
        return this.client.emit('test-topic', { msg: 'hello test topic'})
    }
}